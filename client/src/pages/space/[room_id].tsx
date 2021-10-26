import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { Box, chakra, Stack, VStack } from "@chakra-ui/react";
import { CommentBlock } from "../../components/space/CommentBlock";
import { CommentProps } from "../../components/space/CommentItem";
import { MemberBlock } from "../../components/space/MemberBlock";
import { UserWithStatus } from "../../components/space/MemberItem";
import { TimerBlock } from "../../components/space/TimerBlock";

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

  return (
    <Layout contentTitle={spaceId}>
      <Stack direction={"row"} p={4} bg={"gray.50"}>
        <VStack flex={3}>
          <Video src={"/testMovie.mp4"} />
          <MemberBlock members={membersMock} />
          <Box bg={"gray.200"} w={"100%"} h={48} />
        </VStack>
        <VStack flex={1} maxW={"384px"}>
          <TimerBlock remainSec={200} fullSec={300} sectionTitle={"発表"} />
          <CommentBlock comments={commentMock} />
        </VStack>
      </Stack>
    </Layout>
  );
};

export default Room;
