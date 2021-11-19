import Layout from "../../Layout";
import { Box, chakra, Spinner, Stack, VStack } from "@chakra-ui/react";
import { ConfigBlock } from "./configBlock/ConfigBlock";

import { TimerBlockContainer } from "./timerBlock/TimerBlockContainer";
import React from "react";
import { useRoom } from "../../../lib/hooks/useRoom";
import { MemberBlockContainer } from "./memberBlock/MemberBlockContainer";
import { TimetableBlockContainer } from "./timetableBlock/TimetableBlockContainer";
import { CommentBlockContainer } from "./commentBlock/CommentBlockContainer";
import { ReactionBlockContainer } from "./reactionBlock/ReactionBlockContainer";
import { CameraBlockContainer } from "./cameraBlock/CameraBlockContainer";
import { ConfigBlockContainer } from "./configBlock/ConfigBlockContainer";
import { ScreenBlockContainer } from "./screenBlock/ScreenBlockContainer";

const Video = chakra("video");

type LTPageProps = {};

export const LTContainer: React.VFC<LTPageProps> = () => {
  const room = useRoom();
  if (!room)
    return (
      <div>
        Loading room?
        <Spinner />
      </div>
    );

  return (
    <Layout contentTitle={room.title} footer={false}>
      <Stack
        direction={"row"}
        p={4}
        bg={"gray.50"}
        css={{ height: "calc(100vh - 68px)" }}
      >
        <VStack flex={3}>
          <ScreenBlockContainer />
          <MemberBlockContainer />
          <TimetableBlockContainer />
        </VStack>
        <VStack flex={1} maxW={"384px"}>
          <CameraBlockContainer />
          <ConfigBlockContainer />
          <TimerBlockContainer />
          <ReactionBlockContainer />
          <CommentBlockContainer />
        </VStack>
      </Stack>
    </Layout>
  );
};
