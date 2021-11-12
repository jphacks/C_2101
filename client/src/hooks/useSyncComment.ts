import { useList } from "react-use";
import { CommentProps } from "../components/page/space/CommentItem";
import { MutableRefObject, useEffect } from "react";
import { RoomData, SfuRoom } from "skyway-js";
import { Member } from "./useRoom";
import { UserResponse } from "@api-schema/api/@types";
import { SkywayData } from "../types/skywayData";

type UseSyncCommentParam = {
  roomRef: MutableRefObject<SfuRoom | undefined>;
  memberFetcher: (peerId: string) => Member | undefined;
  clientUser: UserResponse;
};

const unknownUser: Omit<UserResponse, "email"> = {
  id: -1,
  iconUrl: "",
  name: "unknown user",
};

export const useSyncComment = ({
  roomRef,
  clientUser,
  memberFetcher,
}: UseSyncCommentParam) => {
  const [commentList, { push: pushComment }] = useList<CommentProps>([]);

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

  useEffect(() => {
    const room = roomRef.current;
    if (!room) return;

    const openListener = () => {
      pushComment({
        user: clientUser,
        text: "入室しました",
        timestamp: new Date(),
        textColor: "teal.800",
      });
    };

    const peerJoinListener = (peerId: string) => {
      pushComment({
        user: memberFetcher(peerId) ?? unknownUser,
        text: "入室しました",
        timestamp: new Date(),
        textColor: "teal.800",
      });
    };

    const peerLeaveListener = (peerId: string) => {
      pushComment({
        user: memberFetcher(peerId) ?? unknownUser,
        text: "退室しました",
        timestamp: new Date(),
        textColor: "teal.800",
      });
    };

    const dataListener = (param: RoomData) => {
      const srcUser = memberFetcher(param.src) ?? unknownUser;
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
    };

    room.on("open", openListener);
    room.on("peerJoin", peerJoinListener);
    room.on("peerLeave", peerLeaveListener);
    room.on("data", dataListener);

    return () => {
      room.off("open", openListener);
      room.off("peerJoin", peerJoinListener);
      room.off("peerLeave", peerLeaveListener);
      room.off("data", dataListener);
    };
  });

  return {
    sendComment,
    commentList,
  };
};
