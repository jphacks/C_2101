import React from "react";
import { UserResponse } from "../../api/@types";
import {
  Avatar,
  Flex,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";

export type CommentProps = {
  user: Omit<UserResponse, "email">;
  text: string;
  timestamp: Date;
};

export const CommentItem: React.VFC<CommentProps> = ({
  user,
  text,
  timestamp,
}) => {
  return (
    <HStack width={"full"} p={1}>
      <Avatar
        size={"md"}
        name={user.name}
        src={user.iconUrl}
        alignSelf={"self-start"}
      />
      <Stack width={"full"}>
        <Flex>
          <Heading size={"sm"} textColor={"gray.600"}>
            {user.name}
          </Heading>
          <Spacer />
          <Heading size={"sm"} textColor={"gray.600"}>
            {timestamp.toLocaleTimeString()}
          </Heading>
        </Flex>
        <Text textColor={"gray.800"}>{text}</Text>
      </Stack>
    </HStack>
  );
};
