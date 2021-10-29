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
import { useRoom } from "../hooks/useRoom";

const Explore: React.VFC = () => {
  const { rooms } = useRoom();

  if (rooms === undefined) {
    return <></>;
  }

  // 新しいもの順にソート
  rooms.sort((a, b) => {
    return a.startAt < b.startAt ? 1 : -1;
  });

  return (
    <Layout>
      <Stack maxW={"100vw"}>
        <Stack align={"center"}>
          <Stack
            align={"start"}
            textAlign={"center"}
            spacing={{ base: 8, md: 14 }}
            py={10}
            flex={"center"}
          >
            <Box width="750px" borderBottom="4px" borderColor={"teal.400"}>
              <Heading fontSize="1.5rem" textAlign={"start"}>
                直近開催のイベント
              </Heading>
            </Box>

            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Explore;
