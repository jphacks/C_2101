import React from "react";
import { Avatar, Text, VStack } from "@chakra-ui/react";
import { UserResponse } from "../../api/@types";
import { AvatarReactionBadge } from "../common/AvatarReactionBadge";

//別のとこに書いたほうがよさそう

export const UserType = {
  Speaker: 1,
  Viewer: 2,
} as const;
export type UserType = typeof UserType[keyof typeof UserType];

export type UserWithStatus = Omit<UserResponse, "email"> & {
  isOnline: boolean;
  reaction?: string;
  type: UserType;
  isOwner: boolean;
};

export const MemberItem: React.VFC<UserWithStatus> = ({
  iconUrl,
  name,
  isOnline,
  reaction,
}) => {
  return (
    <VStack w={20}>
      <Avatar
        name={name}
        src={iconUrl}
        size={"lg"}
        opacity={isOnline ? "1" : "0.5"}
      >
        {reaction && (
          <AvatarReactionBadge reactionEmoji={reaction} size={"4xl"} />
        )}
      </Avatar>
      <Text textColor={isOnline ? "gray.600" : "gray.400"} isTruncated>
        {name}
      </Text>
    </VStack>
  );
};
