import React from "react";
import { Avatar, SystemStyleObject, Text, VStack } from "@chakra-ui/react";
import { UserResponse } from "../../api/@types";
import { AvatarReactionBadge } from "../common/AvatarReactionBadge";

export type UserTypeListener = 1;
export type UserTypePresenter = 2;

export type UserWithStatus = Omit<UserResponse, "email"> & {
  isOnline: boolean;
  reaction: string | undefined;
  type: UserTypeListener | UserTypePresenter;
  isOwner: boolean;
};

export const MemberItem: React.VFC<UserWithStatus> = ({
  iconUrl,
  name,
  isOnline,
  reaction,
}) => {
  const badgeStyles: SystemStyleObject = {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    insetEnd: "0",
    bottom: "0",
  };

  return (
    <VStack>
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
