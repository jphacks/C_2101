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
import React from "react";
import NextLink from "next/link";
import type * as Types from "../../api/@types";

type Props = {
  room: Types.RoomResponse;
};

const RoomCard: React.FC<Props> = ({ room }) => {
  const participants: number = room.speakers.length + room.viewers.length;

  return (
    <Stack>
      <Heading as="u">
        <NextLink href={`/explore/${room.id}`} passHref>
          <Link>{room.title}</Link>
        </NextLink>
      </Heading>
      <Text>{room.description}</Text>
      <Text>{participants}人</Text>
      <Text>{room.startAt}</Text>
    </Stack>
  );
};

export default RoomCard;
