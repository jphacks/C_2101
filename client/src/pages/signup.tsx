import React, { useState } from "react";
import Layout from "../components/layout";
import { useForm } from "react-hook-form";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Image,
  Button,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { useSignup } from "../hooks/useSignup";
const Signup: React.VFC = () => {
  const { fetchSignup } = useSignup();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values: any) {
    try {
      await fetchSignup({
        email: "takex5g@gmail.com",
        icon: null,
        name: "yumoya",
        password: "Sikashikashika71",
      });

      console.log("signin success!");
    } catch (e) {
      console.log("signin failed...");
    }
  }

  const [fileUrl, setFileUrl] = useState(String);
  function processImage(event: any) {
    let file = event.target.files[0];
    // 選択されたファイルが画像かどうか判定する
    // ここでは、jpeg形式とpng形式のみを画像をみなす
    if (file.type != "image/jpeg" && file.type != "image/png") {
      // 画像でない場合は何もせず終了する
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setFileUrl(imageUrl);
  }

  return (
    <Layout>
      <Text fontSize="4xl" textAlign="center" marginBottom="12" marginTop="24">
        LT Spaceへようこそ！
      </Text>
      <Stack spacing={4} maxWidth={500} margin="auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email}>
            {/* <FormLabel>Email address</FormLabel> */}
            <Input
              type="email"
              placeholder="メールアドレス"
              id="email"
              {...register("email", {
                required: "メールアドレスは必須です。",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "メールアドレス形式で入力してください。",
                },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            {/* <FormLabel>Password</FormLabel> */}
            <Input
              type="password"
              placeholder="パスワード"
              id="password"
              {...register("password", {
                required: "パスワードは必須です。",
                minLength: {
                  value: 8,
                  message: "8文字以上入力してください。",
                },
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
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

            <Stack spacing={10}>
              <input
                type="file"
                accept="image/*"
                onChange={processImage}
              ></input>
              {fileUrl ? (
                <Image
                  src={fileUrl}
                  alt="preview"
                  width={100}
                  height={100}
                ></Image>
              ) : (
                <></>
              )}
            </Stack>

            <Button
              bg={"teal.400"}
              color={"white"}
              _hover={{
                bg: "teal.500",
              }}
              isLoading={isSubmitting}
              type="submit"
            >
              続行する
            </Button>
            {/* アカウントをお持ちの場合 : ログインする */}
          </Stack>
        </form>
      </Stack>
    </Layout>
  );
};

export default Signup;
