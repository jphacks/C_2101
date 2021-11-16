import { useRouter } from "next/router";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import Layout from "../Layout";
import NextLink from "next/link";
import { useSignupAction } from "../../lib/hooks/useAuth";

type FormData = {
  email: string;
  password: string;
  name: string;
};

export const PageSignup = () => {
  const router = useRouter();
  const toast = useToast();
  const fetchSignup = useSignupAction();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (values: FormData) => {
    fetchSignup({
      email: values.email,
      icon: fileBase64,
      name: values.name,
      password: values.password,
    })
      .then(() => {
        toast({
          title: "アカウント生成に成功しました。",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/");
      })
      .catch((error: any) => {
        toast({
          title: error as string,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      });
  };

  const [fileUrl, setFileUrl] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const processImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    const allowFileTypes = ["image/jpeg", "image/png"];
    if (!file || !allowFileTypes.includes(file.type)) {
      setFileUrl("");
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setFileUrl(imageUrl);
    let fr = new FileReader();
    fr.onload = function (evt) {
      if (evt.target == null || evt.target.result == null) return;
      const content = evt.target.result as string;
      setFileBase64(content.slice(content.indexOf(",") + 1));
    };
    fr.readAsDataURL(file);
  };

  return (
    <Layout>
      <Text fontSize="4xl" textAlign="center" marginBottom="12" marginTop="24">
        LT Spaceへようこそ！
      </Text>

      <Stack spacing={4} maxWidth={500} margin="auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.email} mt={4}>
            <FormLabel>メールアドレス</FormLabel>
            <Input
              type="email"
              placeholder="メールアドレス"
              id="email"
              {...register("email", {
                required: "メールアドレスは必須です。",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "メールアドレス形式で入力してください。",
                },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password} mt={4}>
            <FormLabel>パスワード</FormLabel>
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
                maxLength: {
                  value: 32,
                  message: "32文字以内で入力してください。",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/,
                  message:
                    "パスワードには大文字・小文字、数字を含める必要があります。",
                },
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.name} mt={4}>
            <FormLabel>ユーザーネーム</FormLabel>
            <Input
              type="name"
              placeholder="ユーザーネーム"
              id="name"
              {...register("name", {
                required: "ユーザーネームは必須です。",
                minLength: {
                  value: 2,
                  message: "2文字以上入力してください。",
                },
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          <FormLabel mt={4}>プロフィール画像</FormLabel>
          <input type="file" accept="image/*" onChange={processImage} />
          {fileUrl && (
            <Image src={fileUrl} alt="preview" width={100} height={100} />
          )}
          <Stack spacing={10}>
            <Button
              mt={8}
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
            <Text>
              アカウントをお持ちの場合 :{" "}
              <NextLink href={"/login"} passHref>
                <Link to="/login" color="teal.400">
                  ログインする
                </Link>
              </NextLink>
            </Text>
          </Stack>
        </form>
      </Stack>
    </Layout>
  );
};
