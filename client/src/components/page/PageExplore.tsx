import Layout from "../Layout";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import RoomCard from "./explore/RoomCard";
import React from "react";
import { useUser } from "../../lib/hooks/useUser";
import { useRoomList } from "../../lib/hooks/useRoomList";
export const PageExplore: React.VFC = () => {
  const user = useUser();
  const rooms = useRoomList();

  if (!rooms || !user) {
    return <></>;
  }

  // 参加登録したスペース
  const now = new Date();
  const joinRooms = rooms.filter((room) => {
    if (now > new Date(room.finishAt)) {
      return false;
    }

    const roomUsers = [...room.speakers, ...room.viewers];
    return (
      room.owner.id === user.id || roomUsers.some((item) => item.id === user.id)
    );
  });

  // 新しいもの順にソート
  const sortedRooms = [...rooms].sort((a, b) => {
    return a.startAt < b.startAt ? 1 : -1;
  });

  return (
    <Layout>
      <Stack
        as={Box}
        textAlign={"center"}
        spacing={{ base: 8, md: 14 }}
        paddingTop={{ base: 20, md: 36 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          新しいLT Spaceへようこそ <br />
          <Text as={"span"} color={"green.400"} fontSize="3rem">
            video conferencing service
          </Text>
        </Heading>

        <Text color={"gray.500"}>
          LT
          Spaceはオンライン発表会に特化したクラウドベースなビデオチャットプラットフォームです。
          <br />
          コミュニティ内でのLT会や勉強会など、快適なオンライン発表環境を提供します。
        </Text>
        <Stack
          direction={"column"}
          spacing={3}
          align={"center"}
          alignSelf={"center"}
          position={"relative"}
        >
          <NextLink href={"/explore/new"} passHref>
            <Button
              colorScheme={"green"}
              bg={"green.400"}
              rounded={"full"}
              px={6}
              _hover={{
                bg: "green.500",
              }}
            >
              スペースを作成する
            </Button>
          </NextLink>
        </Stack>
      </Stack>

      <Stack align={"center"} maxW={"800px"} w="100%" margin="auto">
        <Stack
          align={"start"}
          textAlign={"center"}
          w="100%"
          py={10}
          px={5}
          flex={"center"}
        >
          <Box width="100%" borderBottom="4px" borderColor={"teal.400"}>
            <Heading fontSize="1.5rem" textAlign={"start"}>
              参加登録したスペース
            </Heading>
          </Box>
          <Text>
            {joinRooms.length === 0
              ? "参加登録しているスペースはありません。"
              : ""}
          </Text>
          {joinRooms.map((room) => (
            <Box key={room.id} w="100%">
              <RoomCard room={room} key={room.id + "xx"} />
              <br />
            </Box>
          ))}
          <br />

          <Box width="100%" borderBottom="4px" borderColor={"teal.400"}>
            <Heading fontSize="1.5rem" textAlign={"start"}>
              新着スペース
            </Heading>
          </Box>

          {sortedRooms.map((room) => (
            <Box key={room.id} w="100%">
              <RoomCard room={room} />
              <br />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
};
