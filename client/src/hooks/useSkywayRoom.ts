import { RefObject, useCallback, useEffect, useRef } from "react";
import Peer, { SfuRoom } from "skyway-js";
import { useAsync, useList } from "react-use";
import {
  RoomResponse,
  SkywayCredentialsModel,
  UserResponse,
} from "../api/@types";
import { CommentProps } from "../components/space/CommentItem";
import { SkywayData } from "../types/skywayData";
import { useSyncTimer } from "./useSyncTimer";
import { useSyncTimetable } from "./useSyncTimetable";
import { Member } from "./useRoom";
import { useSyncMemberStatus } from "./useSyncMemberStatus";

type UseLTPageParam = {
  roomInfo: RoomResponse;
  memberList: Member[];
  memberMap: Record<number, Member>;
  clientUser: UserResponse;
  credential: SkywayCredentialsModel;
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
  screenVideoRef,
  cameraVideoRef,
}: UseLTPageParam) => {
  const isOwner = roomInfo.owner.id === clientUser.id;
  const isSpeaker = roomInfo.speakers.some((item) => item.id === clientUser.id);

  const peerRef = useRef<Peer>();
  const roomRef = useRef<SfuRoom>();

  const streamMapRef = useRef<Record<number, MediaStream>>({});

  const localStreamRef = useRef<MediaStream>();

  const [commentList, { push: pushComment }] = useList<CommentProps>([]);

  const getMemberFromPeerId = useCallback(
    (peerId: string) => {
      console.log("getMemberFromPeerId", memberMap, peerId);
      return memberMap[Number(peerId)];
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

  useEffect(() => {
    console.log(memberStatusMap);
  }, [memberStatusMap]);

  //初期化
  useAsync(async () => {
    //とりあえずオーナーとspeakerにはマイクとカメラ許可を求める
    const localStream =
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

    localStreamRef.current = localStream;

    const peer = new Peer(String(clientUser.id), {
      key: skywayApiKey,
      credential: credential,
      debug: 2,
    });

    peerRef.current = peer;

    peer.once("open", () => {
      const sfuRoom = peer.joinRoom<SfuRoom>(roomInfo.id.toString(), {
        mode: "sfu",
        stream: localStream,
      });

      roomRef.current = sfuRoom;

      sfuRoom.once("open", () => {
        pushComment({
          user: clientUser,
          text: "入室しました",
          timestamp: new Date(),
          textColor: "teal.800",
        });
        //うーん強引
        updateStatus();
      });
      sfuRoom.on("peerJoin", (peerId) => {
        pushComment({
          user: getMemberFromPeerId(peerId),
          text: "入室しました",
          timestamp: new Date(),
          textColor: "teal.800",
        });
      });
      sfuRoom.on("peerLeave", (peerId) => {
        pushComment({
          user: getMemberFromPeerId(peerId),
          text: "退室しました",
          timestamp: new Date(),
          textColor: "teal.800",
        });
      });

      sfuRoom.on("data", (param) => {
        const srcUser = getMemberFromPeerId(param.src);
        const data = param.data as SkywayData;

        if (data.type === "reactionText") {
          //コメント受信
          pushComment({
            user: srcUser,
            text: data.text,
            timestamp: new Date(data.timestamp),
          });
          return;
        }
      });

      sfuRoom.on("stream", (stream) => {
        console.log("receive stream", stream.peerId, timetable);
        streamMapRef.current = {
          ...streamMapRef.current,
          [Number(stream.peerId)]: stream,
        };
      });
    });

    return () => {
      peerRef.current?.destroy();
      console.log("peer destroy");
    };
  }, []);

  //見ているstreamの更新
  useEffect(() => {
    const presentingUser = getCurrentPresentingUser();
    if (!presentingUser) return;

    if (presentingUser.id === clientUser.id) {
      //自分
      if (!localStreamRef.current) return;
      cameraVideoRef.current!.srcObject = localStreamRef.current;
      cameraVideoRef.current!.playsInline = true;
      void cameraVideoRef.current!.play();
    } else {
      //他の人
      const stream = streamMapRef.current[presentingUser.id];
      if (!stream) {
        console.log("stream is not received");
        return;
      }

      console.log(`display stream from ${presentingUser.id}`);
      cameraVideoRef.current!.srcObject = stream;
      cameraVideoRef.current!.playsInline = true;
      void cameraVideoRef.current!.play();
    }
  }, [cameraVideoRef, clientUser.id, getCurrentPresentingUser]);

  const sendComment = (text: string) => {
    const timestamp = new Date();
    const data: SkywayData = {
      type: "reactionText",
      text: text,
      timestamp: timestamp.valueOf(),
    };

    roomRef.current?.send(data);

    pushComment({
      user: clientUser,
      text: text,
      timestamp: timestamp,
    });
  };

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
  };
};
