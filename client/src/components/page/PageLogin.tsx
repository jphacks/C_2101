import { useRouter } from "next/router";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Layout from "../Layout";
import NextLink from "next/link";
import React, { useEffect } from "react";
import { useUser } from "../../lib/hooks/useUser";
import { useLoginAction } from "../../lib/hooks/useAuth";

type FormData = {
  email: string;
  password: string;
};

export const PageLogin = () => {
  const router = useRouter();
  const toast = useToast();

  const user = useUser();
  const login = useLoginAction();

  const spaceId = router.query.next?.toString();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const handleClickLogin = async (values: FormData) => {
    //ここの値はフォームからとる
    login({
      email: values.email,
      password: values.password,
    })
      .then(() => {
        toast({
          title: "ログインに成功しました。",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        const nextQuery = router.query.next;
        if (nextQuery && typeof nextQuery === "string") {
          router.push(nextQuery);
        } else {
          router.push("/explore");
        }
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

  useEffect(() => {
    //すでにログイン済み
    if (user) {
      void router.push(
        router.query["next"] ? String(router.query["next"]) : "/explore"
      );
    }
  }, [router, user]);

  return (
    <Layout>
      <Text fontSize="4xl" textAlign="center" marginBottom="12" marginTop="24">
        LT Spaceにログイン
      </Text>

      <Stack spacing={4} maxWidth={500} margin="auto">
        <form onSubmit={handleSubmit(handleClickLogin)}>
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
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

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
              LT Spaceを初めて利用する場合 :{" "}
              <NextLink href={"/signup"} passHref>
                <Link color="teal.400">無料登録する</Link>
              </NextLink>
            </Text>
          </Stack>
        </form>
      </Stack>
    </Layout>
  );
};
