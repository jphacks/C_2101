import { Button, Text } from "@chakra-ui/react";
import React from "react";
import Layout from "../components/layout";
import { useLogin } from "../hooks/useLogin";

const Login: React.VFC = () => {
  const { fetchLogin, logout, user, userError, authHeader } = useLogin();

  const handleClickLogin = async () => {
    //ここの値はフォームからとる
    try {
      await fetchLogin({
        email: "test@mail.com",
        password: "1234Abcd",
      });

      console.log("login success!");
    } catch (e) {
      console.log("login failed...");
    }
  };

  const handleClickLogout = async () => {
    //ここの値はフォームからとる
    await logout();
  };

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
