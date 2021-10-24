import { Avatar, Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

type Props = {
  contentTitle?: string;
};

const Header: React.FC<Props> = ({ contentTitle }) => {
  return (
    <Flex
      as={"nav"}
      bg={"gray.800"}
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={4}
      color={"gray.100"}
    >
      <Flex align={"center"} mr={5}>
        <Heading as={"h1"} size={"lg"} color={"gray.100"}>
          <NextLink href={"/"}>LT Space</NextLink>
        </Heading>
      </Flex>
      <HStack
        width={{ base: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        mt={{ base: 4, md: 0 }}
      >
        <Text fontSize={"2xl"}>{contentTitle}</Text>
      </HStack>
      <Box display={"block"} mt={{ base: 4, md: 0 }}>
        <Avatar name={"user name"} size={"sm"} />
      </Box>
    </Flex>
  );
};

export default Header;
