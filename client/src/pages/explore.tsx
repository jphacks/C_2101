import React from "react";
import Layout from "../components/layout";
import {
  FormControl,
  FormLabel,
  Input,
  Center,
  Container,
  Box,
  Flex,
  Stack,
  HStack,
  VStack,
  Button,
  FormErrorMessage,
  Text,
  Link,
  Heading,
} from "@chakra-ui/react";
import RoomCard from "../components/room/room-card";
import { useLogin } from "../hooks/useLogin";
import { useRoom } from "../hooks/useRoom";

const Explore: React.VFC = () => {
  const { user } = useLogin();
  const { rooms } = useRoom();

  if (!rooms || !user) {
    return <></>;
  }

  // 参加登録したルーム
  const now = new Date();
  const joinRooms = rooms.filter((room) => {
    if (now > room.finishAt) {
      return false;
    }

    let result = room.owner.id === user.id;

    room.speakers.forEach(
      (speaker) => (result = result || speaker.id === user.id)
    );
    room.viewers.forEach(
      (viewer) => (result = result || viewer.id === user.id)
    );

    return result;
  });

  // 新しいもの順にソート
  rooms.sort((a, b) => {
    return a.startAt < b.startAt ? 1 : -1;
  });

  return (
    <Layout>
      <Stack maxW={"100vw"}>
        <Stack align={"center"}>
          <Stack align={"start"} textAlign={"center"} py={10} flex={"center"}>
            <Box width="750px" borderBottom="4px" borderColor={"teal.400"}>
              <Heading fontSize="1.5rem" textAlign={"start"}>
                参加登録したルーム
              </Heading>
            </Box>
            <Text>
              {joinRooms.length === 0 ? "参加登録したルームはありません。" : ""}
            </Text>
            {joinRooms.map((room) => (
              <>
                <RoomCard room={room} key={room.id + 'xx'} />
                <br />
              </>
            ))}
            <br />

            <Box width="750px" borderBottom="4px" borderColor={"teal.400"}>
              <Heading fontSize="1.5rem" textAlign={"start"}>
                新着ルーム
              </Heading>
            </Box>

            {rooms.map((room) => (
              <>
                <RoomCard room={room} key={room.id} />
                <br />
              </>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Explore;
