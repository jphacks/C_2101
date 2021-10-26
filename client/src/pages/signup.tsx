import React from "react";
import Layout from "../components/layout";
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
const Signup: React.VFC = () => {
  return (
    <Layout>
      <Text fontSize="4xl" textAlign="center" marginBottom="12" marginTop="24">
        LT Spaceへようこそ！
      </Text>
      <Stack spacing={4} maxWidth={500} margin="auto">
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
            続行する
          </Button>
          {/* アカウントをお持ちの場合 : ログインする */}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Signup;
