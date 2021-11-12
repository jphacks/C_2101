import {
  Avatar,
  Flex,
  Stack,
  Spacer,
  Text,
  Link,
  Heading,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import type * as Types from "@api-schema/api/@types";
import { transform } from "../../../utils/datetime";

type Props = {
  room: Types.RoomResponse;
};

const RoomCard: React.FC<Props> = ({ room }) => {
  const participants: number = room.speakers.length + room.viewers.length;

  return (
    <Stack width="750px">
      <Flex>
        <Heading as="u" fontSize={"1.3rem"} textAlign={"start"} width="600px">
          <NextLink href={`/explore/${room.id}`} passHref>
            <Link>{room.title}</Link>
          </NextLink>
        </Heading>
        <Spacer />
        <Text fontSize={"0.7rem"} color={"#999999"} fontWeight="bold">
          開催日: {transform(new Date(room.startAt), "YYYY/MM/DD")}
        </Text>
      </Flex>

      <Text
        fontSize={"0.9rem"}
        color={"#999999"}
        fontWeight="bold"
        textAlign={"start"}
        width="600px"
      >
        {room.description.slice(0, 70)}
        {room.description.length > 70 ? "..." : ""}
      </Text>

      <Flex>
        <Flex align={"center"}>
          <Avatar size={"xs"} src={room.owner.iconUrl} />
          <Text fontSize={"0.8rem"} marginLeft="10px" fontWeight="bold">
            {room.owner.name}
          </Text>
        </Flex>
        <Spacer />
        <Text fontSize={"0.8rem"}>参加者: {participants}人</Text>
      </Flex>
    </Stack>
  );
};

export default RoomCard;
