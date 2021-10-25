import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import {
  Box,
  chakra,
  Flex,
  Grid,
  GridItem,
  HStack,
  Stack,
  VStack,
  Text,
} from "@chakra-ui/react";

const Video = chakra("video");

const Room: React.VFC = () => {
  const router = useRouter();

  const spaceId = router.query.room_id?.toString();

  return (
    <Layout contentTitle={spaceId}>
      <Stack direction={"row"} p={4} bg={"gray.50"}>
        <VStack flex={3}>
          <Video src={"/testMovie.mp4"} />
          <Box bg={"gray.200"} w={"100%"} h={20}></Box>
          <Box bg={"gray.200"} w={"100%"} h={48}></Box>
        </VStack>
        <VStack flex={1} maxW={"384px"}>
          <Box bg={"gray.300"} width={"100%"} h={48}></Box>
          <Box bg={"gray.200"} width={"100%"} h={32}>
            aaaa aaaa aaaa aaaaaaaa aaaa aaaa aaaaaaaa aaaa aaaa aaaaaaaa aaaa
            aaaa aaaaaaaa aaaa aaaa aaaa
            {/*<Text></Text>*/}
          </Box>
        </VStack>
      </Stack>

    </Layout>
  );
};

export default Room;
