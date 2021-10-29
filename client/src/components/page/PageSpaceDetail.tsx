import Layout from "../Layout";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { transform } from "../../utils/datetime";
import React from "react";
import { useRoom } from "../../hooks/useRoom";
import { useJoinRoom } from "../../hooks/useJoinRoom";
import { useUnJoinRoom } from "../../hooks/useUnJoinRoom";
import { useRouter } from "next/router";

export const PageSpaceDetail: React.VFC<{
  roomId: number;
}> = ({ roomId }) => {
  const { room, mutate } = useRoom(roomId);

  const fetchJoin = useJoinRoom(roomId);
  const fetchUnJoin = useUnJoinRoom(roomId);

  const router = useRouter();

  if (!room || !roomId) {
    return (
      <Layout>
        <></>
      </Layout>
    );
  }

  const handleClickJoin = async () => {
    // await fetchJoin({
    //   type:
    // }).then()
    //最後にmutateを叩かないと画面に表示されてる状態が更新されない
  };

  const handleClickEnterRoom = async () => {
    await router.push(`/space/${roomId}`);
  };

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
      </Stack>

      <Stack maxW={"100vw"}>
        <Stack align={"center"}>
          <Stack align={"start"} textAlign={"center"} py={10} flex={"center"}>
            <Box width="750px" borderBottom="4px" borderColor={"teal.400"}>
              <Heading fontSize="1.5rem" textAlign={"start"}>
                {room.title}
              </Heading>
            </Box>
            <Text width="750px" textAlign={"start"}>
              {room.description
                .split("\n")
                .map((str, index) =>
                  str === "" ? <br /> : <p key={index}>{str}</p>
                )}
            </Text>

            <Flex width="100%">
              <Flex align={"center"} />
              <Spacer />
              <Text fontSize={"0.7rem"} color={"#999999"} fontWeight="bold">
                開催日: {transform(new Date(room.startAt), "YYYY/MM/DD")}
              </Text>
            </Flex>

            <br />

            <Box width="750px" borderBottom="4px" borderColor={"teal.400"}>
              <Heading fontSize="1.5rem" textAlign={"start"}>
                登壇者
              </Heading>
            </Box>
            <Text>
              {room.speakers.length === 0 ? "まだ参加情報がありません。" : ""}
            </Text>
            {room.speakers.map((speaker) => (
              <Flex align={"center"} key={speaker.id}>
                <Avatar size={"xs"} src={speaker.iconUrl} />
                <Text fontSize={"0.8rem"} marginLeft="10px" fontWeight="bold">
                  {speaker.name} 「{speaker.title}」
                </Text>
              </Flex>
            ))}

            <br />

            <Box width="750px" borderBottom="4px" borderColor={"teal.400"}>
              <Heading fontSize="1.5rem" textAlign={"start"}>
                視聴者
              </Heading>
            </Box>
            <Text>
              {room.viewers.length === 0 ? "まだ参加情報がありません。" : ""}
            </Text>
            {room.viewers.map((viewer) => (
              <Flex align={"center"} key={viewer.id}>
                <Avatar size={"xs"} src={viewer.iconUrl} />
                <Text fontSize={"0.8rem"} marginLeft="10px" fontWeight="bold">
                  {viewer.name}
                </Text>
              </Flex>
            ))}

            <br />

            <Flex align={"center"} width="100%">
              <Button
                mt={8}
                borderRadius={0}
                marginRight={"7px"}
                bg={"teal.400"}
                color={"white"}
                _hover={{
                  bg: "teal.500",
                }}
                type="submit"
              >
                参加登録
              </Button>

              <Button
                mt={8}
                borderRadius={0}
                marginRight={"10px"}
                bg={"gray.400"}
                color={"white"}
                _hover={{
                  bg: "gray.500",
                }}
                type="submit"
              >
                参加辞退
              </Button>

              <Spacer />

              <Button
                mt={8}
                borderRadius={0}
                bg={"teal.400"}
                color={"white"}
                _hover={{
                  bg: "teal.500",
                }}
                type="submit"
              >
                ルームに参加
              </Button>
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  );
};
