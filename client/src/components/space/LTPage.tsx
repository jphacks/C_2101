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
import React, { useRef} from "react";
import { AuthHeader } from "../../hooks/useLogin";
import {
  RoomResponse,
  SkywayCredentialsModel,
  UserResponse,
} from "../../api/@types";
import { useEffectOnce, useList } from "react-use";
import Peer, { SfuRoom } from "skyway-js";
import { SkywayData } from "../../types/skywayData";

const Video = chakra("video");

type LTPageProps = {
  room: RoomResponse;
  authHeader: AuthHeader;
  user: UserResponse;
  credential: SkywayCredentialsModel;
};

const skywayApiKey = "401e1886-919c-4988-ba47-ac85cae091a5";

// interface RoomData {
//   src: string;
//   data: SkywayData
// }

export const LTPage: React.VFC<LTPageProps> = ({
  room,
  authHeader,
  user,
  credential,
}) => {
  console.log("LTPage", room);
  const peerRef = useRef<Peer>();
  const roomRef = useRef<SfuRoom>();

  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  const [commentList, { push: pushComment }] = useList<CommentProps>();

  const memberMap: Record<number, UserResponse> = [
    ...room.speakers,
    ...room.viewers,
  ].reduce<Record<number, UserResponse>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  const identifyUser = (userId: number) => memberMap[userId];

  useEffectOnce(() => {
    const peer = new Peer(String(user.id), {
      key: skywayApiKey,
      credential: credential,
      debug: 3,
    });

    peerRef.current = peer;
    console.log(peerRef.current);

    peer.once("open", () => {
      const sfuRoom = peer.joinRoom<SfuRoom>(room.id.toString(), {
        mode: "sfu",
      });

      roomRef.current = sfuRoom;

      sfuRoom.once("open", () => {
        console.log("room open");
        console.log(sfuRoom);
        const comment: CommentProps = {
          user: user,
          text: "入室しました",
          timestamp: new Date(),
        };
        pushComment(comment);
      });

      sfuRoom.on("data", (param) => {
        const srcUser = identifyUser(Number(param.src));
        const data = param.data as SkywayData;

        if (data.type === "reactionText") {
          const comment: CommentProps = {
            user: srcUser,
            text: data.text,
            timestamp: new Date(data.timestamp),
          };
          pushComment(comment);
        }
      });
    });
  });

  const sendComment = (text: string) => {
    const timestamp = new Date();
    const data: SkywayData = {
      type: "reactionText",
      text: text,
      timestamp: timestamp.valueOf(),
    };

    roomRef.current?.send(data);

    pushComment({
      user: user,
      text: text,
      timestamp: timestamp,
    });
  };

  const handleSubmit = (text: string) => {
    sendComment(text);
  };

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
    <Layout contentTitle={room.title}>
      <Text>{String(credential)}</Text>
      <Stack direction={"row"} p={4} bg={"gray.50"}>
        <VStack flex={3}>
          <Box rounded={8} p={4} bg={"gray.200"} w={"full"} h={"full"}>
            <Video ref={screenVideoRef} />
          </Box>

          <MemberBlock members={membersMock} />
          <TimetableBlock cards={timetableDataMock} />
        </VStack>
        <VStack flex={1} maxW={"384px"}>
          <Box bg={"gray.200"} w={"100%"} h={64} rounded={8} />
          <ConfigBlock />
          <TimerBlock remainSec={200} fullSec={300} sectionTitle={"発表"} />
          <CommentBlock comments={commentList} onSubmit={handleSubmit} />
        </VStack>
      </Stack>
    </Layout>
  );
};
