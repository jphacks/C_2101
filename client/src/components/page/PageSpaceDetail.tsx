import Layout from "../Layout";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Input,
  useToast,
  useDisclosure,
  Radio,
  RadioGroup,
  Image,
} from "@chakra-ui/react";
import { transform } from "../../utils/datetime";
import React, { useState } from "react";
import { useRoom } from "../../hooks/useRoom";
import { useJoinRoom } from "../../hooks/useJoinRoom";
import { useUnJoinRoom } from "../../hooks/useUnJoinRoom";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { UserType } from "./space/MemberItem";
import { ShareBtns } from "./explore/ShareButton";

export const PageSpaceDetail: React.VFC<{
  roomId: number;
}> = ({ roomId }) => {
  const { room, mutate } = useRoom(roomId);

  const fetchJoin = useJoinRoom(roomId);
  const fetchUnJoin = useUnJoinRoom(roomId);

  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [titleFormValue, setTitleFormValue] = useState<string>();
  const [userType, setUserType] = useState(1);
  const toast = useToast();

  if (!room || !roomId) {
    return (
      <Layout>
        <></>
      </Layout>
    );
  }

  const handleClickJoin = async () => {
    await fetchJoin({
      title: titleFormValue,
      type: userType,
    })
      .then(() => mutate())
      .then((res) => {
        console.log(res);
        toast({
          title: "登録しました",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      });
    //最後にmutateを叩かないと画面に表示されてる状態が更新されない
  };

  const handleClickUnJoin = async () => {
    await fetchUnJoin()
      .then(() => mutate())
      .then((res) => {
        console.log(res);
        toast({
          title: "登録削除しました",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      });
  };
  const Thumbnail: React.VFC<{ imageUrl: string }> = ({ imageUrl }) => {
    const Img = () =>
      imageUrl ? (
        <Image
          borderRadius={5}
          w="100%"
          h="100%"
          objectFit="cover"
          src={imageUrl}
          alt="thumbnail"
        />
      ) : (
        <Box />
      );
    return (
      <Box borderRadius={5} width="100%" height="300px" bg="gray.200">
        <Img />
      </Box>
    );
  };

  return (
    <Layout>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>参加登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleClickJoin();
              }}
            >
              <FormControl>
                <RadioGroup
                  onChange={(usertype) => {
                    setUserType(Number(usertype));
                  }}
                  value={userType}
                >
                  <Stack direction="row">
                    <Radio value={UserType.Speaker}>登壇者</Radio>
                    <Radio value={UserType.Viewer}>視聴者</Radio>
                  </Stack>
                </RadioGroup>

                {UserType.Speaker === userType ? (
                  <>
                    <FormLabel>発表タイトル</FormLabel>
                    <Input
                      type={"text"}
                      onChange={(event) =>
                        setTitleFormValue(event.target.value)
                      }
                    />
                  </>
                ) : (
                  <></>
                )}

                <Button type={"submit"}>登録</Button>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Stack maxW={"800px"} w="100%" margin="auto">
        <Stack align={"center"}>
          <Stack align={"start"} textAlign={"center"} flex={"center"} pt={5}>
            <Flex alignItems="flex-end" w="100%">
              <Box textAlign="left">
                <Text fontSize={"1rem"} color={"#999999"} fontWeight="bold">
                  開催日: {transform(new Date(room.startAt), "YYYY/MM/DD")}
                </Text>
                <Heading fontSize="1.7rem" textAlign={"start"} pt={1}>
                  {room.title}
                </Heading>
              </Box>
              <Spacer />
              <ShareBtns room={room} />
            </Flex>
            <Box py="15px" w={"100%"}>
              <Thumbnail imageUrl={room.imageUrl} />
            </Box>

            <Box width="100%" borderBottom="4px" borderColor={"teal.400"}>
              <Heading fontSize="1.5rem" textAlign={"start"}>
                スペース概要
              </Heading>
            </Box>
            <Box width="100%" textAlign={"start"}>
              {room.description
                .split("\n")
                .map((str: string, index: number) =>
                  str === "" ? <br key={index} /> : <p key={index}>{str}</p>
                )}
            </Box>

            <br />
            <Box width="100%" borderBottom="4px" borderColor={"teal.400"}>
              <Heading fontSize="1.5rem" textAlign={"start"}>
                登壇者
              </Heading>
            </Box>
            <Text>
              {room.speakers.length === 0 ? "まだ参加情報がありません。" : ""}
            </Text>
            {room.speakers.map((speaker) => (
              <Flex align={"center"} key={speaker.id}>
                <Avatar size={"xs"} src={speaker.iconUrl} />
                <Text fontSize={"0.8rem"} marginLeft="10px" fontWeight="bold">
                  {speaker.name} 「{speaker.title}」
                </Text>
              </Flex>
            ))}

            <br />

            <Box width="750px" borderBottom="4px" borderColor={"teal.400"}>
              <Heading fontSize="1.5rem" textAlign={"start"}>
                視聴者
              </Heading>
            </Box>
            <Text>
              {room.viewers.length === 0 ? "まだ参加情報がありません。" : ""}
            </Text>
            {room.viewers.map((viewer) => (
              <Flex align={"center"} key={viewer.id}>
                <Avatar size={"xs"} src={viewer.iconUrl} />
                <Text fontSize={"0.8rem"} marginLeft="10px" fontWeight="bold">
                  {viewer.name}
                </Text>
              </Flex>
            ))}

            <br />

            <Flex align={"center"} width="100%">
              <Button
                mt={8}
                borderRadius={0}
                marginRight={"7px"}
                bg={"teal.400"}
                color={"white"}
                _hover={{
                  bg: "teal.500",
                }}
                type="submit"
                onClick={onOpen}
              >
                参加登録
              </Button>

              <Button
                mt={8}
                borderRadius={0}
                marginRight={"10px"}
                bg={"gray.400"}
                color={"white"}
                _hover={{
                  bg: "gray.500",
                }}
                type="submit"
                onClick={handleClickUnJoin}
              >
                参加辞退
              </Button>

              <Spacer />

              <NextLink href={`/space/${roomId}`} passHref>
                <Button
                  mt={8}
                  borderRadius={0}
                  bg={"teal.400"}
                  color={"white"}
                  _hover={{
                    bg: "teal.500",
                  }}
                  type="submit"
                >
                  ルームに参加
                </Button>
              </NextLink>
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  );
};
