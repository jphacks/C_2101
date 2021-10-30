import { RefObject, useCallback, useEffect, useRef } from "react";
import Peer, { SfuRoom } from "skyway-js";
import { useAsync } from "react-use";
import {
  RoomResponse,
  SkywayCredentialsModel,
  UserResponse,
} from "../api/@types";
import { useSyncTimer } from "./useSyncTimer";
import { useSyncTimetable } from "./useSyncTimetable";
import { Member } from "./useRoom";
import { useSyncMemberStatus } from "./useSyncMemberStatus";
import { useSyncComment } from "./useSyncComment";

type UseLTPageParam = {
  roomInfo: RoomResponse;
  memberList: Member[];
  memberMap: Record<number, Member>;
  clientUser: UserResponse;
  credential: SkywayCredentialsModel;
  credentialSub: SkywayCredentialsModel;
  screenVideoRef: RefObject<HTMLVideoElement>;
  cameraVideoRef: RefObject<HTMLVideoElement>;
};

const skywayApiKey = "401e1886-919c-4988-ba47-ac85cae091a5";

const createTimestamp = () => Date.now();

export const useSkywayRoom = ({
  roomInfo,
  memberList,
  memberMap,
  clientUser,
  credential,
  credentialSub,
  screenVideoRef,
  cameraVideoRef,
}: UseLTPageParam) => {
  const isOwner = roomInfo.owner.id === clientUser.id;
  const isSpeaker = roomInfo.speakers.some((item) => item.id === clientUser.id);

  const peerRef = useRef<Peer>();
  const subPeerRef = useRef<Peer>();
  const roomRef = useRef<SfuRoom>();

  const streamMapRef = useRef<Record<number, MediaStream>>({});

  const localCameraStreamRef = useRef<MediaStream>();
  const localScreenStreamRef = useRef<MediaStream>();

  const getMemberFromPeerId = useCallback(
    (peerId: string) => {
      console.log("getMemberFromPeerId", memberMap, peerId);
      const regex = /(?<userId>[0-9]+)-(?<index>[0-9]+)-(?<rand>[0-9]+)/;
      const result = regex.exec(peerId);
      const userId = result?.groups?.userId;
      return memberMap[Number(userId)];
    },
    [memberMap]
  );
  const memberFetcher = useCallback(
    (peerId) => getMemberFromPeerId(peerId),
    [getMemberFromPeerId]
  );

  const {
    state: timetable,
    timetableAction,
    getCurrentPresentingUser,
  } = useSyncTimetable({
    roomRef: roomRef,
    isOwner: isOwner,
    roomInfo: roomInfo,
    memberFetcher: memberFetcher,
  });

  const { calcRemainTimerSec, timerAction } = useSyncTimer({
    roomRef: roomRef,
    memberFetcher: memberFetcher,
    isOwner: isOwner,
  });

  const { memberStatusMap, updateStatus } = useSyncMemberStatus({
    peerRef: peerRef,
    roomRef: roomRef,
    memberFetcher: memberFetcher,
    memberList: memberList,
  });

  const { sendComment, commentList } = useSyncComment({
    roomRef: roomRef,
    clientUser: clientUser,
    memberFetcher: memberFetcher,
  });

  useEffect(() => {
    console.log(memberStatusMap);
  }, [memberStatusMap]);

  //初期化
  useAsync(async () => {
    if (peerRef.current) {
      peerRef.current?.destroy();
    }

    //とりあえずオーナーとspeakerにはマイクとカメラ許可を求める
    const localCameraStream =
      isOwner || isSpeaker
        ? await navigator.mediaDevices
            .getUserMedia({
              audio: true,
              video: true,
            })
            .catch((err) => {
              console.log(err);
              return undefined;
            })
        : undefined;

    localCameraStreamRef.current = localCameraStream;

    const peer = new Peer(credential.peerId, {
      key: skywayApiKey,
      credential: credential,
      debug: 2,
    });
    peerRef.current = peer;

    peer.once("open", () => {
      console.log("open peer", peer);
      const sfuRoom = peer.joinRoom<SfuRoom>(roomInfo.id.toString(), {
        mode: "sfu",
        stream: localCameraStreamRef.current,
      });

      roomRef.current = sfuRoom;

      sfuRoom.on("open", () => {
        updateStatus();
      });

      sfuRoom.on("stream", (stream) => {
        console.log("receive stream", stream.peerId, timetable);
        streamMapRef.current = {
          ...streamMapRef.current,
          [stream.peerId]: stream,
        };
        console.log(streamMapRef.current);
        setTimeout(() => {
          updateStreamVideoRef();
        });
      });
    });

    return () => {
      roomRef.current?.close();
      peerRef.current?.destroy();

      subPeerRef.current?.destroy();

      console.log("peer destroy");
      console.log("subpeer destroy");
    };
  }, []);

  const startScreenShare = async () => {
    if (subPeerRef.current) {
      subPeerRef.current?.destroy();
    }

    const localScreenStream =
      isOwner || isSpeaker
        ? await navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: true,
          })
        : undefined;
    localScreenStreamRef.current = localScreenStream;

    if (!localScreenStream) return;

    const subPeer = new Peer(credentialSub.peerId, {
      key: skywayApiKey,
      credential: credentialSub,
      debug: 2,
    });
    subPeerRef.current = subPeer;

    subPeer.once("open", () => {
      console.log("open subpeer", subPeer);
      const sfuRoom = subPeer.joinRoom<SfuRoom>(roomInfo.id.toString(), {
        mode: "sfu",
        stream: localScreenStreamRef.current,
      });

      sfuRoom.on("open", () => {
        // updateStatus();
      });
    });
  };

  //TODO
  //peerIdから、どっちが主かをわかるようにする
  //getDisplayMediaのawaitとかをどうにかする

  const updateStreamVideoRef = useCallback(() => {
    const presentingUser = getCurrentPresentingUser();

    console.log("updateStreamVideoRef", presentingUser);
    if (!presentingUser) return;

    if (presentingUser.id === clientUser.id) {
      //自分
      if (localCameraStreamRef.current) {
        cameraVideoRef.current!.srcObject = localCameraStreamRef.current;
        cameraVideoRef.current!.playsInline = true;
        void cameraVideoRef.current!.play();
      }
      if (localScreenStreamRef.current) {
        screenVideoRef.current!.srcObject = localScreenStreamRef.current;
        screenVideoRef.current!.playsInline = true;
        void screenVideoRef.current!.play();
      }
    } else {
      //他の人

      const status = memberStatusMap[presentingUser.id];

      const idList = status.peerIdList.map((peerId) => {
        const regex = /(?<userId>[0-9]+)-(?<index>[0-9]+)-(?<rand>[0-9]+)/;
        const result = regex.exec(peerId);

        return {
          peerId: peerId,
          userId: result?.groups?.userId,
          index: result?.groups?.index,
          rand: result?.groups?.rand,
        };
      });

      console.log(idList);
      const mainPeerId = idList.find(
        (item) => item && Number(item.index) == 0
      )?.peerId;
      const subPeerId = idList.find(
        (item) => item && Number(item.index) == 1
      )?.peerId;

      const cameraStream = Object.values(
        roomRef.current?.remoteStreams ?? {}
      ).find((item) => item.peerId === mainPeerId);

      const screenStream = Object.values(
        roomRef.current?.remoteStreams ?? {}
      ).find((item) => item.peerId === subPeerId);

      if (cameraStream) {
        cameraVideoRef.current!.srcObject = cameraStream;
        cameraVideoRef.current!.playsInline = true;
        void cameraVideoRef.current!.play();
      }

      if (screenStream) {
        screenVideoRef.current!.srcObject = screenStream;
        screenVideoRef.current!.playsInline = true;
        void screenVideoRef.current!.play();
      }
    }
  }, [
    cameraVideoRef,
    clientUser.id,
    getCurrentPresentingUser,
    memberStatusMap,
    screenVideoRef,
  ]);

  //見ているstreamの更新
  useEffect(() => {
    updateStreamVideoRef();
  }, [updateStreamVideoRef]);

  const isEnteredRoom = !!peerRef.current?.open && !!roomRef.current;

  return {
    isEnteredRoom,
    sendComment,
    commentList,
    timetable,
    timetableAction,
    calcRemainTimerSec,
    timerAction,
    memberStatusMap,
    isOwner,
    startScreenShare,
  };
};
