import { Text, Button } from "@chakra-ui/react";
import React from "react";
import Layout from "../components/layout";
import { useLogin } from "../hooks/useLogin";
import NextLink from "next/link";

const Home: React.VFC = () => {
  const { logout, authHeader, user } = useLogin();
  const handleClickLogout = async () => {
    //ここの値はフォームからとる
    await logout();
  };

  return (
    <Layout>
      <Text>Home</Text>
      <NextLink href={"/login"} passHref>
        <Button onClick={handleClickLogout}>Login</Button>
      </NextLink>
      <Button onClick={handleClickLogout}>Logout</Button>
      {/* Authorizationの表示はエラー出るけど、表示しなければ良い */}
      <Text>header: {authHeader?.Authorization}</Text>
      <Text>user: {user?.name}</Text>
    </Layout>
  );
};

export default Home;
