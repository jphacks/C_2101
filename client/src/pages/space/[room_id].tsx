import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { Box, chakra, Stack, VStack } from "@chakra-ui/react";
import { CommentBlock } from "../../components/space/CommentBlock";
import { CommentProps } from "../../components/space/CommentItem";
import { MemberBlock } from "../../components/space/MemberBlock";
import { UserWithStatus } from "../../components/space/MemberItem";
import { TimerBlock } from "../../components/space/TimerBlock";
import { ConfigBlock } from "../../components/space/ConfigBlock";
import { TimetableCardProps } from "../../components/space/TimetableCard";
import { TimetableBlock } from "../../components/space/TimetableBlock";

const Video = chakra("video");

const Room: React.VFC = () => {
  const router = useRouter();

  const spaceId = router.query.room_id?.toString();

  //ログインしていなかったら/loginに飛ばす
  // const { isAuthed } = useLogin();
  // useEffect(() => {
  //   if (!isAuthed) {
  //     console.log("not authed");
  //     void router.push(`/login?next=${router.asPath}`);
  //   }
  // });

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
      id: 334,
      isOnline: true,
      isOwner: false,
      type: 1,
    },
    {
      name: "name desuyo",
      iconUrl: "https://bit.ly/dan-abramov",
      id: 334,
      isOnline: true,
      reaction: "👍",
      isOwner: false,
      type: 1,
    },
    {
      name: "name desuyo",
      iconUrl: "https://bit.ly/dan-abramov",
      id: 334,
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
    <Layout contentTitle={spaceId}>
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

export default Room;
