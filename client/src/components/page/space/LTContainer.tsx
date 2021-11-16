import Layout from "../../Layout";
import { Box, Button, chakra, Stack, VStack } from "@chakra-ui/react";
import { MemberBlock } from "./memberBlock/MemberBlock";
import { TimetableBlock } from "./timetableBlock/TimetableBlock";
import { ConfigBlock } from "./configBlock/ConfigBlock";
import { CommentBlock } from "./commentBlock/CommentBlock";

import { TimerBlockContainer } from "./timerBlock/TimerBlockContainer";
import React from "react";
import { useRoom } from "../../../states/useRoom";

const Video = chakra("video");

type LTPageProps = {};

export const LTContainer: React.VFC<LTPageProps> = () => {
  const room = useRoom();

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
