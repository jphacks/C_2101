import { TimetableCardProps } from "./TimetableCard";
import Layout from "../layout";
import { Box, chakra, Stack, VStack } from "@chakra-ui/react";
import { MemberBlock } from "./MemberBlock";
import { TimetableBlock } from "./TimetableBlock";
import { ConfigBlock } from "./ConfigBlock";
import { CommentBlock } from "./CommentBlock";
import React, { useRef } from "react";
import { AuthHeader } from "../../hooks/useLogin";
import {
  RoomResponse,
  SkywayCredentialsModel,
  UserResponse,
} from "../../api/@types";
import { useSkywayRoom } from "../../hooks/useSkywayRoom";
import { TimerBlockContainer } from "./TimerBlockContainer";
import { Member } from "../../hooks/useRoom";

const Video = chakra("video");

type LTPageProps = {
  room: RoomResponse;
  memberMap: Record<number, Member>;
  memberList: Member[];
  authHeader: AuthHeader;
  user: UserResponse;
  credential: SkywayCredentialsModel;
};

export const LTPage: React.VFC<LTPageProps> = ({
  room,
  memberList,
  memberMap,
  user,
  credential,
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
  } = useSkywayRoom({
    roomInfo: room,
    memberMap: memberMap,
    memberList: memberList,
    clientUser: user,
    credential: credential,
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

  return (
    <Layout contentTitle={room.title}>
      <Stack direction={"row"} p={4} bg={"gray.50"}>
        <VStack flex={3}>
          <Box rounded={8} p={4} bg={"gray.200"} w={"full"} h={"full"}>
            <Video ref={screenVideoRef} />
          </Box>

          <MemberBlock members={memberList} memberStateMap={memberStatusMap} />
          <TimetableBlock cards={timetableProp} />
        </VStack>
        <VStack flex={1} maxW={"384px"}>
          <Box bg={"gray.200"} w={"100%"} h={64} rounded={8} p={2}>
            <Video
              w={"full"}
              h={"full"}
              ref={cameraVideoRef}
              muted
              rounded={8}
            />
          </Box>
          <ConfigBlock />
          <TimerBlockContainer
            isOwner={isOwner}
            timetable={timetable}
            timerAction={timerAction}
            timetableAction={timetableAction}
            calcRemainTimerSec={calcRemainTimerSec}
          />
          <CommentBlock comments={commentList} onSubmit={handleSubmit} />
        </VStack>
      </Stack>
    </Layout>
  );
};
