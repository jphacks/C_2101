import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { Box, chakra, Stack, VStack } from "@chakra-ui/react";
import { CommentBlock } from "../../components/space/commentBlock";
import { CommentProps } from "../../components/space/commentItem";

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

  return (
    <Layout contentTitle={spaceId}>
      <Stack direction={"row"} p={4} bg={"gray.50"}>
        <VStack flex={3}>
          <Video src={"/testMovie.mp4"} />
          <Box bg={"gray.200"} w={"100%"} h={20} />
          <Box bg={"gray.200"} w={"100%"} h={48} />
        </VStack>
        <VStack flex={1} maxW={"384px"}>
          <Box bg={"gray.300"} width={"100%"} h={48} />
          <CommentBlock comments={commentMock} />
        </VStack>
      </Stack>
    </Layout>
  );
};

export default Room;
