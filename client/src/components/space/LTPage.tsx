import { CommentProps } from "./CommentItem";
import { UserWithStatus } from "./MemberItem";
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
import { useEffectOnce } from "react-use";
import Peer, { SfuRoom } from "skyway-js";

const Video = chakra("video");

type LTPageProps = {
  room: RoomResponse;
  authHeader: AuthHeader;
  user: UserResponse;
  credential: SkywayCredentialsModel;
};

const skywayApiKey = "401e1886-919c-4988-ba47-ac85cae091a5";

export const LTPage: React.VFC<LTPageProps> = ({
  room,
  authHeader,
  user,
  credential,
}) => {
  console.log("LTPage");
  const peerRef = useRef<Peer>();
  const roomRef = useRef<SfuRoom>();

  useEffectOnce(() => {
    const peer = new Peer(String(user.id), {
      key: skywayApiKey,
      credential: credential,
      debug: 3,
    });

    peerRef.current = peer;
    console.log(peerRef.current);

    peer.once("open", () => {
      roomRef.current = peer.joinRoom<SfuRoom>(room.id.toString(), {
        mode: "sfu",
      });
    });
  });

  const commentMock: CommentProps[] = [
    {
      user: {
        name: "name desuyo",
        iconUrl: "https://bit.ly/dan-abramov",
        id: 334,
      },
      timestamp: new Date(),
      text: "kyoumo ichinichi ganbaru zoi",
    },
    {
      user: {
        name: "name desuyo",
        iconUrl: "https://bit.ly/dan-abramov",
        id: 334,
      },
      timestamp: new Date(),
      text: "kyoumo ichinichi ganbaru zoi kyoumo ichinichi ganbaru zoi kyoumo ichinichi ganbaru zoi ",
    },
    {
      user: {
        name: "name desuyo",
        iconUrl: "https://bit.ly/dan-abramov",
        id: 334,
      },
      timestamp: new Date(),
      text: "kyoumo ichinichi ganbaru zoi kyoumo ichinichi ganbaru zoi kyoumo ichinichi ganbaru zoi ",
    },
    {
      user: {
        name: "name desuyo",
        iconUrl: "https://bit.ly/dan-abramov",
        id: 334,
      },
      timestamp: new Date(),
      text: "kyoumo ichinichi ganbaru zoi kyoumo ichinichi ganbaru zoi kyoumo ichinichi ganbaru zoi kyoumo ichinichi ganbaru zoi kyoumo ichinichi ganbaru zoi kyoumo ichinichi ganbaru zoi kyoumo ichinichi ganbaru zoi ",
    },
  ];

  const membersMock: UserWithStatus[] = [
    {
      name: "name desuyo",
      iconUrl: "https://bit.ly/dan-abramov",
      id: 0,
      isOnline: true,
      isOwner: false,
      type: 1,
    },
    {
      name: "name desuyo",
      iconUrl: "https://bit.ly/dan-abramov",
      id: 1,
      isOnline: true,
      reaction: "👍",
      isOwner: false,
      type: 1,
    },
    {
      name: "name desuyo",
      iconUrl: "https://bit.ly/dan-abramov",
      id: 2,
      isOnline: false,
      isOwner: false,
      type: 1,
    },
  ];

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
    <Layout contentTitle={"スペース名"}>
      <Text>{String(credential)}</Text>
      <Stack direction={"row"} p={4} bg={"gray.50"}>
        <VStack flex={3}>
          <Box rounded={8} p={4} bg={"gray.200"}>
            <Video src={"/testMovie.mp4"} />
          </Box>

          <MemberBlock members={membersMock} />
          <TimetableBlock cards={timetableDataMock} />
        </VStack>
        <VStack flex={1} maxW={"384px"}>
          <Box bg={"gray.200"} w={"100%"} h={64} rounded={8} />
          <ConfigBlock />
          <TimerBlock remainSec={200} fullSec={300} sectionTitle={"発表"} />
          <CommentBlock comments={commentMock} />
        </VStack>
      </Stack>
    </Layout>
  );
};
