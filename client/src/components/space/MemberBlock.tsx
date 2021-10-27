import React from "react";
import { Box, HStack, StackDivider, Text, VStack } from "@chakra-ui/react";
import { MemberItem, UserWithStatus } from "./MemberItem";

type MemberBlockProps = {
  members: UserWithStatus[];
};

export const MemberBlock: React.VFC<MemberBlockProps> = ({ members }) => {
  const onlineMembers = members.filter((member) => member.isOnline);
  const offlineMembers = members.filter((member) => !member.isOnline);

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
        <HStack>
          {members.map((item) => (
            <MemberItem {...item} key={`member-group-${item.id}`} />
          ))}
        </HStack>
      </VStack>
    );
  };
