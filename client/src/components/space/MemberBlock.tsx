import React from "react";
import { Box, HStack, StackDivider, Text, VStack } from "@chakra-ui/react";
import { MemberItem, UserWithStatus } from "./MemberItem";
import { Member } from "../../hooks/useRoom";
import { MemberStatus } from "../../hooks/useSyncMemberStatus";

type MemberBlockProps = {
  members: Member[];
  memberStateMap: Record<number, MemberStatus>;
};

export const MemberBlock: React.VFC<MemberBlockProps> = ({
  members,
  memberStateMap,
}) => {
  const memberWithStatus = members.map((member) => ({
    ...member,
    ...memberStateMap[member.id],
  }));

  const onlineMembers = memberWithStatus.filter(
    (member) => memberStateMap[member.id]?.isOnline
  );
  const offlineMembers = memberWithStatus.filter(
    (member) => !memberStateMap[member.id]?.isOnline
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

const MemberGroup: React.FC<{ groupName: string; members: UserWithStatus[] }> =
  ({ groupName, members }) => {
    return (
      <VStack>
        <Text alignSelf={"flex-start"} fontWeight={"bold"}>
          {groupName}
        </Text>
        <HStack h={24}>
          {members.map((item) => (
            <MemberItem {...item} key={`member-group-${item.id}`} />
          ))}
        </HStack>
      </VStack>
    );
  };
