import { Text, Button } from "@chakra-ui/react";
import React from "react";
import { Box, Heading, Container, Stack, Link } from "@chakra-ui/react";
import Layout from "../components/layout";
import NextLink from "next/link";

const Home: React.VFC = () => {
  return (
    <Layout>
      <Container maxW={"100vw"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            新しいLT Spaceへようこそ <br />
            <Text as={"span"} color={"green.400"} fontSize="3rem">
              video conferencing service
            </Text>
          </Heading>

          <Text color={"gray.500"}>
            LT
            Spaceはオンライン発表会に特化したクラウドベースなビデオチャットプラットフォームです。
            <br />
            コミュニティ内でのLT会や勉強会など、快適なオンライン発表環境を提供します。
          </Text>
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <NextLink href={"/login"} passHref>
              <Button
                colorScheme={"green"}
                bg={"green.400"}
                rounded={"full"}
                px={6}
                _hover={{
                  bg: "green.500",
                }}
              >
                Get Started
              </Button>
            </NextLink>
            <Button variant={"link"} colorScheme={"blue"} size={"sm"}>
              <a href={"https://github.com/jphacks/C_2101"}>Learn more</a>
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Home;
