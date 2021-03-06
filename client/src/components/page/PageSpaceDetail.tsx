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
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { transform } from "../../utils/datetime";
import React, { useState } from "react";
import { useJoinRoom } from "../../lib/hooks/useJoinRoom";
import { useUnJoinRoom } from "../../lib/hooks/useUnJoinRoom";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { UserType } from "./space/memberBlock/MemberItem";
import { ShareBtns } from "./explore/ShareButton";
import { useRefreshRoom, useRoomById } from "../../lib/hooks/useRoom";

export const PageSpaceDetail: React.VFC<{
  roomId: number;
}> = ({ roomId }) => {
  const room = useRoomById(roomId);
  const refreshRoom = useRefreshRoom(roomId);

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
    });
    refreshRoom();
    //TODO 最後にmutateを叩かないと画面に表示されてる状態が更新されない
  };

  const handleClickUnJoin = async () => {
    await fetchUnJoin();
    refreshRoom();
  };
  const secToMinutes = (second: number) => {
    return Math.floor((second * 10) / 60) / 10;
  };

  const startAt = new Date(room.startAt);
  const finishAt = new Date(room.finishAt);

  const Thumbnail: React.VFC<{ imageUrl: string }> = ({ imageUrl }) => {
    const Img = () => (
      <Image
        borderRadius={5}
        w="100%"
        h="100%"
        objectFit="cover"
        src={imageUrl ? imageUrl : "/no_image.png"}
        alt="thumbnail"
      />
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
                    <FormLabel mt={2} mb={1}>
                      発表タイトル
                    </FormLabel>
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

                <Button
                  type={"submit"}
                  my={3}
                  marginRight={"7px"}
                  bg={"teal.400"}
                  color={"white"}
                  _hover={{
                    bg: "teal.500",
                  }}
                  onClick={onOpen}
                >
                  登録
                </Button>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Stack maxW={"800px"} w="100%" margin="auto" pb={8}>
        <Stack align={"center"} w="100%">
          <Stack
            align={"start"}
            textAlign={"center"}
            w="100%"
            flex={"center"}
            pt={5}
            px={5}
          >
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
                日程
              </Heading>
            </Box>

            <UnorderedList align="left" pl={5}>
              <ListItem>開催日：{transform(startAt, "YYYY/MM/DD")}</ListItem>
              <ListItem>
                開催時間：{transform(startAt, "HH:mm")}
                {` ~ `}
                {startAt.getMonth() !== finishAt.getMonth() &&
                startAt.getDate() !== finishAt.getDate()
                  ? `${transform(finishAt, "MM/DD")}日 `
                  : startAt.getDate() !== finishAt.getDate()
                  ? `${transform(finishAt, "DD")}日 `
                  : ""}
                {transform(finishAt, "HH:mm")}
              </ListItem>
              <ListItem>
                発表時間：{secToMinutes(room.presentationTimeLimit)}分
              </ListItem>
              <ListItem>
                質問時間：{secToMinutes(room.questionTimeLimit)}分
              </ListItem>
            </UnorderedList>
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

            <Box width="100%" borderBottom="4px" borderColor={"teal.400"}>
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
                  スペースに参加
                </Button>
              </NextLink>
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  );
};
