import { TimetableCardProps } from "./TimetableCard";
import Layout from "../layout";
import { Box, chakra, Stack, Text, VStack } from "@chakra-ui/react";
import { MemberBlock } from "./MemberBlock";
import { TimetableBlock } from "./TimetableBlock";
import { ConfigBlock } from "./ConfigBlock";
import { TimerBlock } from "./TimerBlock";
import { CommentBlock } from "./CommentBlock";
import React, { useRef } from "react";
import { AuthHeader } from "../../hooks/useLogin";
import {
  RoomResponse,
  SkywayCredentialsModel,
  UserResponse,
} from "../../api/@types";
import { useSkywayRoom } from "../../hooks/useSkywayRoom";

const Video = chakra("video");

type LTPageProps = {
  room: RoomResponse;
  authHeader: AuthHeader;
  user: UserResponse;
  credential: SkywayCredentialsModel;
};

export const LTPage: React.VFC<LTPageProps> = ({
  room,
  authHeader,
  user,
  credential,
}) => {
  console.log("LTPage", room);

  const {
    roomRef,
    peerRef,
    members,
    isEnteredRoom,
    commentList,
    sendComment,
    timetable,
  } = useSkywayRoom({
    roomInfo: room,
    clientUser: user,
    credential: credential,
  });
  // const peerRef = useRef<Peer>();
  // const roomRef = useRef<SfuRoom>();

  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  const handleSubmit = (text: string) => {
    sendComment(text);
  };

  const timetableProp: TimetableCardProps[] = timetable.sessions.map(
    (item, index) => {
      const tags = [];
      if (item.user.id === user.id) {
        tags.push("You");
      }
      if (timetable.pointer.inSession) {
        if (timetable.pointer.current === index) {
          tags.push("Presenting");
        }
        if (timetable.pointer.current + 1 === index) {
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

  const timetableDataMock: TimetableCardProps[] = [
    {
      user: {
        name: "name desuyo",
        iconUrl: "https://bit.ly/dan-abramov",
        id: 334,
      },
      title: `This is the "title"`,
      tags: ["You"],
    },
    {
      user: {
        name: "name desuyo",
        iconUrl: "https://bit.ly/dan-abramov",
        id: 334,
      },
      title: `This is the "super super super super long title"`,
      tags: ["Next"],
    },
  ];

  return (
    <Layout contentTitle={room.title}>
      <Text>{String(credential)}</Text>
      <Stack direction={"row"} p={4} bg={"gray.50"}>
        <VStack flex={3}>
          <Box rounded={8} p={4} bg={"gray.200"} w={"full"} h={"full"}>
            <Video ref={screenVideoRef} />
          </Box>

          <MemberBlock members={Object.values(members)} />
          <TimetableBlock cards={timetableProp} />
        </VStack>
        <VStack flex={1} maxW={"384px"}>
          <Box bg={"gray.200"} w={"100%"} h={64} rounded={8}>
            <Video ref={cameraVideoRef} />
          </Box>
          <ConfigBlock />
          <TimerBlock remainSec={200} fullSec={300} sectionTitle={"発表"} />
          <CommentBlock comments={commentList} onSubmit={handleSubmit} />
        </VStack>
      </Stack>
    </Layout>
  );
};
