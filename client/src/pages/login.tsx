import React from "react";
import Layout from "../components/layout";
import { useLogin } from "../hooks/useLogin";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Text,
} from "@chakra-ui/react";
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
        <Stack spacing={4} maxWidth={500} margin="auto">
          <Text fontSize="6xl">LT Spaceへようこそ！</Text>
          <FormControl id="email">
            {/* <FormLabel>Email address</FormLabel> */}
            <Input type="email" placeholder="メールアドレス" />
          </FormControl>
          <FormControl id="password">
            {/* <FormLabel>Password</FormLabel> */}
            <Input type="password" placeholder="パスワード" />
          </FormControl>
          <Stack spacing={10}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
            >
              {/* <Checkbox>Remember me</Checkbox> */}
              {/* <Link color={"blue.400"}>Forgot password?</Link> */}
            </Stack>
            <Button
              bg={"teal.400"}
              color={"white"}
              _hover={{
                bg: "teal.500",
              }}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
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
