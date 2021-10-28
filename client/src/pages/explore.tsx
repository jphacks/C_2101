import React from "react";
import Layout from "../components/layout";
import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  Stack,
  Button,
  FormErrorMessage,
  Text,
  Link,
  Heading,
} from "@chakra-ui/react";
import RoomCard from "../components/room/room-card";
import { useRoom } from "../hooks/useRoom";

const Explore: React.VFC = () => {
  const { rooms } = useRoom();

  if (rooms === undefined) {
    return <></>;
  }

  // 新しいもの順にソート
  rooms.sort((a, b) => {
    if (a.id < b.id) return 1;
    if (a.id > b.id) return -1;
    return 0;
  });

  return (
    <Layout>
      <Stack textAlign={"center"} spacing={{ base: 8, md: 14 }} py={10}>
        <Stack textAlign={"start"}>
          <Heading fontSize="1.5rem">直近開催のイベント</Heading>
          <Text>こんにちは</Text>
        </Stack>
      </Stack>
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </Layout>
  );
};

export default Explore;
