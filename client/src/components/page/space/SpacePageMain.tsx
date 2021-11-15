import { TimetableCardProps } from "./timetableBlock/TimetableCard";
import Layout from "../../Layout";
import { Box, Button, chakra, Stack, VStack } from "@chakra-ui/react";

import { MemberBlock } from "./memberBlock/MemberBlock";
import { TimetableBlock } from "./timetableBlock/TimetableBlock";
import { ConfigBlock } from "./configBlock/ConfigBlock";
import { CommentBlock } from "./commentBlock/CommentBlock";
import { ReactionBlock } from "./reactionBlock/ReactionBlock";

import {
  RoomResponse,
  SkywayCredentialsModel,
  UserResponse,
} from "@api-schema/api/@types";
import { useLegacySkywayRoom } from "../../../hooks/useLegacySkywayRoom";
import { TimerBlockContainer } from "./timerBlock/TimerBlockContainer";
import { Member } from "../../../hooks/useRoom";
import React, { useRef } from "react";

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
  } = useLegacySkywayRoom({
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
    <Layout contentTitle={room.title}>
      <Stack direction={"row"} p={4} bg={"gray.50"}>
        <VStack flex={3}>
          <Box
            rounded={8}
            p={4}
            bg={"gray.200"}
            w={"full"}
            h={"full"}
            textAlign={"center"}
          >
            <Video ref={screenVideoRef} muted />
            <Button
              colorScheme={"teal"}
              onClick={handleClickStartScreenShare}
              alignSelf={"center"}
            >
              画面共有を開始する
            </Button>
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
          <ReactionBlock />
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
