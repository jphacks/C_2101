import { Button, Text } from "@chakra-ui/react";
import React from "react";
import Layout from "../components/layout";
import { useLogin } from "../hooks/useLogin";
import { useToast } from "@chakra-ui/react";

const Login: React.VFC = () => {
  const { fetchLogin, logout, user, userError, authHeader } = useLogin();

  const handleClickLogin = async () => {
    //ここの値はフォームからとる
    fetchLogin({
      email: "test@mail.com",
      password: "1234Abcd",
    })
      .then((_) => {
        toast({
          title: "ログインに成功しました。",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error: string) => {
        toast({
          title: error as string,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      });
  };

  const handleClickLogout = async () => {
    //ここの値はフォームからとる
    await logout();
  };

  const toast = useToast();

  if (!user) {
    return (
      <Layout>
        <Button onClick={handleClickLogin}>Login</Button>
        {userError && <Text>error: {userError.toString()}</Text>}
      </Layout>
    );
  }

  return (
    <Layout>
      <Button onClick={handleClickLogout}>Logout</Button>
      <Text>header: {authHeader?.Authorization}</Text>
      <Text>user: {user?.name}</Text>
    </Layout>
  );
};

export default Login;
