import { Avatar, HStack, Spacer, Stack, Tag, Text } from "@chakra-ui/react";
import React from "react";
import { UserInfo } from "@api-schema/types/user";

export type TimetableCardProps = {
  user: UserInfo;
  title: string;
  tags: string[];
  isCurrentSection: boolean;
};

export const TimetableCard: React.VFC<TimetableCardProps> = ({
  title,
  tags,
  user,
  isCurrentSection,
}) => {
  return (
    <Stack
      bg={"white"}
      w={64}
      h={"full"}
      rounded={8}
      p={4}
      borderColor={isCurrentSection ? "teal" : "white"}
      borderWidth={"3px"}
    >
      <HStack h={4} spacing={4} align={"left"}>
        {tags.map((item, i) => (
          <Tag key={`timetable-card-${title}-${item}-${i}`}>{item}</Tag>
        ))}
      </HStack>
      <Text
        textColor={"gray.800"}
        fontSize={"xl"}
        fontWeight={"bold"}
        noOfLines={2}
      >
        {title}
      </Text>
      <Spacer />
      <HStack>
        <Avatar size={"sm"} name={user.name} src={user.iconUrl} />
        <Text textColor={"gray.800"} fontSize={"md"}>
          {user.name}
        </Text>
      </HStack>
    </Stack>
  );
};
