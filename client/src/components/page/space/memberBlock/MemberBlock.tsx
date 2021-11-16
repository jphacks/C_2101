import React from "react";
import { Box, HStack, StackDivider, Text, VStack } from "@chakra-ui/react";
import { MemberItem } from "./MemberItem";
import { RoomMember } from "@api-schema/types/member";
import { ReactionItem } from "@api-schema/types/reaction";

type MemberBlockProps = {
  members: RoomMember[];
};

export const MemberBlock: React.VFC<MemberBlockProps> = ({ members }) => {
  const onlineMembers = members.filter((member) => member.connection.isOnline);
  const offlineMembers = members.filter(
    (member) => !member.connection.isOnline
  );

  return (
    <Box bg={"gray.200"} w={"100%"} h={40} p={2} rounded={8}>
      <HStack
        divider={<StackDivider borderColor="gray.400" />}
        overflowX={"scroll"}
      >
        <MemberGroup groupName={"Online"} members={onlineMembers} />
        <MemberGroup groupName={"Offline"} members={offlineMembers} />
      </HStack>
    </Box>
  );
};

const MemberGroup: React.FC<{ groupName: string; members: RoomMember[] }> = ({
  groupName,
  members,
}) => {
  //TODO 仮
  const reaction: ReactionItem = {
    emoji: "",
    userId: 0,
    timestamp: 0,
  };

  return (
    <VStack>
      <Text alignSelf={"flex-start"} fontWeight={"bold"}>
        {groupName}
      </Text>
      <HStack h={24}>
        {members.map((item) => (
          <MemberItem
            iconUrl={item.user.iconUrl}
            name={item.user.name}
            isOnline={item.connection.isOnline}
            reaction={reaction}
            key={`member-group-${item.user.id}`}
          />
        ))}
      </HStack>
    </VStack>
  );
};
