import { useRef, useState } from "react";
import Peer, { SfuRoom } from "skyway-js";
import { useEffectOnce, useList } from "react-use";
import {
  RoomResponse,
  SkywayCredentialsModel,
  UserResponse,
} from "../api/@types";
import { UserType } from "../components/space/MemberItem";
import { CommentProps } from "../components/space/CommentItem";
import { SkywayData } from "../types/skywayData";
import { Timetable, TimetableSession } from "../types/timetable";

type UseLTPageParam = {
  roomInfo: RoomResponse;
  clientUser: UserResponse;
  credential: SkywayCredentialsModel;
};

type Member = Omit<UserResponse, "email"> & {
  isOnline: boolean;
  type: UserType;
  isOwner: boolean;
};

const skywayApiKey = "401e1886-919c-4988-ba47-ac85cae091a5";

const createTimestamp = () => Date.now();

export const useSkywayRoom = ({
  roomInfo,
  clientUser,
  credential,
}: UseLTPageParam) => {
  const peerRef = useRef<Peer>();
  const roomRef = useRef<SfuRoom>();

  const [commentList, { push: pushComment }] = useList<CommentProps>();
  const [timetable, setTimetable] = useState<Timetable>({
    sessions: [],
    pointer: {
      inSession: false,
    },
  });

  const setWithSendTimetable = (value: Timetable) => {
    setTimetable(value);
    sendTimetable(value);
  };

  const sendTimetable = (value?: Timetable) => {
    const data: SkywayData = {
      type: "updateTimetable",
      timestamp: createTimestamp(),
      timetable: value ?? timetable,
    };
    roomRef.current?.send(data);
    if (roomRef.current) {
      console.log("sendTimetable", data);
    }
  };

  //初期化
  useEffectOnce(() => {
    const peer = new Peer(String(clientUser.id), {
      key: skywayApiKey,
      credential: credential,
      debug: 3,
    });

    peerRef.current = peer;

    peer.once("open", () => {
      const isOwner = roomInfo.owner.id === clientUser.id;
      const sfuRoom = peer.joinRoom<SfuRoom>(roomInfo.id.toString(), {
        mode: "sfu",
      });

      roomRef.current = sfuRoom;

      sfuRoom.once("open", () => {
        updateMembers();
        pushComment({
          user: clientUser,
          text: "入室しました",
          timestamp: new Date(),
          textColor: "teal.800",
        });

        //オーナーなら
        if (isOwner) {
          const speakersSorted = roomInfo.speakers.sort(
            (a, b) => a.speakerOrder - b.speakerOrder
          );
          const entries: TimetableSession[] = speakersSorted.map((speaker) => {
            return {
              user: speaker,
              title: speaker.title,
              section: [
                {
                  sectionTitle: "発表",
                  lengthSec: roomInfo.presentationTimeLimit,
                },
                {
                  sectionTitle: "質疑応答",
                  lengthSec: roomInfo.presentationTimeLimit,
                },
              ],
            };
          });
          setWithSendTimetable({
            sessions: entries,
            pointer: {
              inSession: false,
            },
          });
        }
      });
      sfuRoom.on("peerJoin", (peerId) => {
        const updatedMembers = updateMembers();
        pushComment({
          user: getMemberFromPeerId(peerId, updatedMembers),
          text: "入室しました",
          timestamp: new Date(),
          textColor: "teal.800",
        });
        if (isOwner) {
          sendTimetable();
        }
      });
      sfuRoom.on("peerLeave", (peerId) => {
        const updatedMembers = updateMembers();
        pushComment({
          user: getMemberFromPeerId(peerId, updatedMembers),
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

        if (data.type === "updateTimetable") {
          setTimetable(data.timetable);
        }
      });
    });

    return () => {
      peerRef.current?.destroy();
    };
  });

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

  const getMemberFromPeerId = (
    peerId: string | number,
    memberList?: Record<number, Member>
  ) => {
    console.log("getMemberFromPeerId", members, peerId);
    return (memberList ?? members)[Number(peerId)];
  };

  const isEnteredRoom = !!peerRef.current?.open && !!roomRef.current;

  const [members, setMembers] = useState<Record<number, Member>>({});
  const updateMembers = () => {
    const updatedMembers = [
      ...roomInfo.speakers.map((item) => ({
        ...item,
        type: UserType.Speaker,
      })),
      ...roomInfo.viewers.map((item) => ({
        ...item,
        type: UserType.Viewer,
      })),
    ]
      .map((item) => ({
        ...item,
        isOnline:
          peerRef.current?.id === String(item.id) ||
          !!roomRef.current?.members.includes(String(item.id)),
        isOwner: roomInfo.owner.id === item.id,
      }))
      .reduce<Record<number, Member>>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
    setMembers(updatedMembers);
    console.log(updatedMembers);
    console.log(roomRef.current);
    return updatedMembers;
  };

  return {
    peerRef,
    roomRef,
    isEnteredRoom,
    members,
    sendComment,
    commentList,
    timetable,
  };
};
