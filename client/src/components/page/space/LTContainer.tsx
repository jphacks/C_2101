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
            <Video src={"testMovie.mp4"} />
            {/*<Video ref={screenVideoRef} muted />*/}
            {/*<Button*/}
            {/*  colorScheme={"teal"}*/}
            {/*  onClick={handleClickStartScreenShare}*/}
            {/*  alignSelf={"center"}*/}
            {/*>*/}
            {/*  画面共有を開始する*/}
            {/*</Button>*/}
          </Box>
          <MemberBlockContainer />
          <TimetableBlockContainer />
        </VStack>
        <VStack flex={1} maxW={"384px"}>
          <Box bg={"gray.200"} w={"100%"} h={64} rounded={8} p={2}>
            {/*<Video*/}
            {/*  w={"full"}*/}
            {/*  h={"full"}*/}
            {/*  ref={cameraVideoRef}*/}
            {/*  muted*/}
            {/*  rounded={8}*/}
            {/*/>*/}
          </Box>
          <ConfigBlock />
          <TimerBlockContainer />
          <ReactionBlockContainer />
          あうあうあ
          <CommentBlockContainer />
        </VStack>
      </Stack>
    </Layout>
  );
};
