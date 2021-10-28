import { Avatar, Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import type * as Types from "../../api/@types";
import { useLogin } from "../../hooks/useLogin";

type Props = {
  contentTitle?: string;
};

const UserMenu: React.FC<Props> = ({ contentTitle }) => {
  const { user } = useLogin();

  if (!user) {
    return <Avatar size={"sm"} />;
  }

  return (
    <>
      <Avatar size={"sm"} src={user.iconUrl} />
    </>
  );
};

export default UserMenu;
