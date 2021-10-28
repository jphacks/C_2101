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
  return (
    <Stack>
      <Heading>
        <NextLink href={`/explore/${room.id}`} passHref>
          <Link>{room.title}</Link>
        </NextLink>
      </Heading>
      <Text>{room.description}</Text>
    </Stack>
  );
};

export default RoomCard;
