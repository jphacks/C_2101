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
import { Token } from "@chakra-ui/styled-system/dist/types/utils";
import * as CSS from "csstype";

export type CommentProps = {
  user: Omit<UserResponse, "email">;
  text: string;
  timestamp: Date;
  textColor?: Token<CSS.Property.Color, "colors">;
};

export const CommentItem: React.VFC<CommentProps> = ({
  user,
  text,
  timestamp,
  textColor,
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
        <Text textColor={textColor ?? "gray.800"}>{text}</Text>
      </Stack>
    </HStack>
  );
};
