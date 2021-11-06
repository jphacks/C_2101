import { TimetableCardProps } from "./../TimetableCard";
import Layout from "../../../Layout";
import { Box, Button, chakra, Stack, VStack } from "@chakra-ui/react";
import { MemberBlock } from "./../MemberBlock";
import { TimetableBlock } from "./../TimetableBlock";
import { ConfigBlock } from "./../ConfigBlock";
import { CommentBlock } from "./CommentBlockSP";
import React, { useRef } from "react";
import {
  RoomResponse,
  SkywayCredentialsModel,
  UserResponse,
} from "../../../../api/@types";
import { useSkywayRoom } from "../../../../hooks/useSkywayRoom";
import { TimerBlockContainer } from "./../TimerBlockContainer";
import { Member } from "../../../../hooks/useRoom";

const Video = chakra("video");

type LTPageProps = {
  room: RoomResponse;
  memberMap: Record<number, Member>;
  memberList: Member[];
  user: UserResponse;
  credential: SkywayCredentialsModel;
  credentialSub: SkywayCredentialsModel;
};

export const SpacePageMain: React.VFC<LTPageProps> = ({
  room,
  memberList,
  memberMap,
  user,
  credential,
  credentialSub,
}) => {
  console.log("LTPage", room);

  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  const {
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
  } = useSkywayRoom({
    roomInfo: room,
    memberMap: memberMap,
    memberList: memberList,
    clientUser: user,
    credential: credential,
    credentialSub: credentialSub,
    screenVideoRef: screenVideoRef,
    cameraVideoRef: cameraVideoRef,
  });
  // const peerRef = useRef<Peer>();
  // const roomRef = useRef<SfuRoom>();

  const handleSubmit = (text: string) => {
    sendComment(text);
  };

  const timetableProp: TimetableCardProps[] = timetable.sessions.map(
    (item, index) => {
      const tags = [];
      if (item.user.id === user.id) {
        tags.push("You");
      }
      if (timetable.pointer.progress === "inSession") {
        if (timetable.pointer.currentSession === index) {
          tags.push("Presenting");
        }
        if (timetable.pointer.currentSession + 1 === index) {
          tags.push("Next");
        }
      }

      return {
        user: item.user,
        title: item.title,
        tags: tags,
      };
    }
  );

  const handleClickStartScreenShare = async () => {
    await startScreenShare();
  };

  return (
    // <Layout>
    <CommentBlock comments={commentList} onSubmit={handleSubmit} />
    // </Layout>
  );
};