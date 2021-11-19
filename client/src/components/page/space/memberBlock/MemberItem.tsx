import React from "react";
import { Avatar, Text, VStack } from "@chakra-ui/react";
import { AvatarReactionBadge } from "../../../common/AvatarReactionBadge";
import { useReactionValue } from "../../../../lib/hooks/useSyncReaction";
import { UserId } from "@api-schema/types/user";

//別のとこに書いたほうがよさそう

export const UserType = {
  Speaker: 1,
  Viewer: 2,
} as const;
export type UserType = typeof UserType[keyof typeof UserType];

export type UserWithStatus = {
  userId: UserId;
  iconUrl: string;
  name: string;
  isOnline: boolean;
};

export const MemberItem: React.VFC<UserWithStatus> = ({
  userId,
  iconUrl,
  name,
  isOnline,
}) => {
  //ここで取るのもどうなのって感じする
  const reaction = useReactionValue(userId);

  return (
    <VStack w={20}>
      <Avatar
        name={name}
        src={iconUrl}
        size={"lg"}
        opacity={isOnline ? "1" : "0.5"}
      >
        {reaction && (
          <AvatarReactionBadge reactionEmoji={reaction.emoji} size={"40px"} />
        )}
      </Avatar>
      <Text textColor={isOnline ? "gray.600" : "gray.400"} isTruncated>
        {name}
      </Text>
    </VStack>
  );
};
