import React from "react";
import {
  Avatar,
  Flex,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  CommentCommonInfo,
  CommentTypeSystem,
  CommentTypeUser,
} from "@api-schema/types/comment";
import { UserInfo } from "@api-schema/types/user";

export type CommentProps = CommentCommonInfo &
  ((CommentTypeUser & { user: UserInfo }) | CommentTypeSystem);

export const CommentItem: React.VFC<CommentProps> = ({
  text,
  timestamp,
  ...props
}) => {
  const name = props.type === "user" ? props.user.name : "Guest";
  const src = props.type === "user" ? props.user.iconUrl : undefined;

  const timeStr = new Date(timestamp).toLocaleTimeString();
  const textColor = props.type === "user" ? "gray.800" : "gray.500";

  return (
    <HStack width={"full"} p={1}>
      <Avatar size={"md"} name={name} src={src} alignSelf={"self-start"} />
      <Stack width={"full"}>
        <Flex>
          <Heading size={"sm"} textColor={"gray.600"}>
            {name}
          </Heading>
          <Spacer />
          <Heading size={"sm"} textColor={"gray.600"}>
            {timeStr}
          </Heading>
        </Flex>
        <Text textColor={textColor}>{text}</Text>
      </Stack>
    </HStack>
  );
};
