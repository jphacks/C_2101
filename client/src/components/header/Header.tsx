import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import UserMenu from "./UserMenu";
import { useLogin } from "../../hooks/useLogin";
type Props = {
  contentTitle?: string;
};
const HeaderLogo = () => {
  const { user } = useLogin();
  let topUrl = "/";
  if (user) topUrl = "/explore";

  return (
    <Heading as={"h1"} size={"lg"} color={"gray.100"}>
      <NextLink href={topUrl}>LT Space</NextLink>
    </Heading>
  );
};
const Header: React.FC<Props> = ({ contentTitle }) => {
  return (
    <Flex
      as={"nav"}
      bg="#012D45"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={4}
      color={"gray.100"}
    >
      <Flex align={"center"} mr={5}>
        <HeaderLogo />
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
        <UserMenu />
      </Box>
    </Flex>
  );
};

export default Header;
