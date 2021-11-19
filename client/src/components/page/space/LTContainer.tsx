import Layout from "../../Layout";
import { Box, chakra, Spinner, Stack, VStack, Grid } from "@chakra-ui/react";
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
      <Grid
        w={"full"}
        // maxW={3000}
        // m="auto"
        templateColumns={{
          base: "60% 40%",
          // sm: "70% 30%",
          // md: "70% 30%",
          lg: "70% 30%",
          // xl: "75% 25%",
        }}
        bg={{
          base: "gray.50",
          sm: "yellow.200",
          md: "green.200",
          lg: "blue.200",
          xl: "red",
        }}
        gap={4}
        p={4}
        css={{ height: "calc(100vh - 68px)" }}
      >
        <VStack flex={3} minWidth="0px" minHeight="0px" width={"100%"}>
          <ScreenBlockContainer />
          <MemberBlockContainer />
          <TimetableBlockContainer />
        </VStack>
        <Grid
          w={"full"}
          pr={4}
          gap={2}
          minHeight="0px"
          minWidth="0px"
          templateRows={{
            base: "auto auto auto auto 1fr",
            // sm: "70% 30%",
            // md: "70% 30%",
            // lg: "40% 70px 25% 74px auto",
            lg: "auto auto auto auto 1fr",
          }}
        >
          <CameraBlockContainer />
          <ConfigBlockContainer />
          <TimerBlockContainer />
          <ReactionBlockContainer />
          <CommentBlockContainer />
        </Grid>
      </Grid>
    </Layout>
  );
};
