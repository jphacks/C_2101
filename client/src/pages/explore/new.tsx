import { Text, Button } from "@chakra-ui/react";
import React from "react";
import Layout from "../../components/layout";
import NextLink from "next/link";

const CreateSpace: React.VFC = () => {
  return (
    <Layout>
      <Text>スペースを作成する</Text>
      <NextLink href={"/login"} passHref>
        <Button>Login</Button>
      </NextLink>
    </Layout>
  );
};

export default CreateSpace;
