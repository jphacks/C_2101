import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import UserMenu from "./UserMenu";
import { useUser } from "../../lib/hooks/useUser";

type Props = {
  contentTitle?: string;
};

const HeaderLogo = () => {
  const user = useUser();
  const topUrl = user ? "/explore" : "/";

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
      padding={4}
      color={"gray.100"}
      w={"full"}
    >
      <Box flex={1} minWidth={"0px"}>
        <Flex
          // width={{ base: "full", md: "auto" }}
          alignItems="center"
        >
          <HeaderLogo />
          <Box pl={3} flex={1} overflow="hidden">
            <Text
              fontSize={"2xl"}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {contentTitle}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Box display={"block"} w={"40px"}>
        <UserMenu />
      </Box>
    </Flex>
  );
};

export default Header;
