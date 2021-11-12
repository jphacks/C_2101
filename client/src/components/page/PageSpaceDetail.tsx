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
  HStack,
} from "@chakra-ui/react";
import { transform } from "../../utils/datetime";
import React, { MouseEventHandler, useState } from "react";
import { useRoom } from "../../hooks/useRoom";
import { useJoinRoom } from "../../hooks/useJoinRoom";
import { useUnJoinRoom } from "../../hooks/useUnJoinRoom";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { UserType } from "./space/MemberItem";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { SiLine } from "react-icons/si";

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
  const ShareBtns = () => {
    const onClickShare = (e: React.MouseEvent<HTMLButtonElement>) => {
      const url = (inTxt: string, inUrl: string) => {
        const txt = encodeURIComponent(inTxt);
        const url = encodeURIComponent(inUrl);
        if (e.currentTarget.getAttribute("data-social") === "twitter")
          return `https://twitter.com/share?text=${txt}&url=${url}`;
        else if (e.currentTarget.getAttribute("data-social") === "facebook")
          return `http://www.facebook.com/share.php?u=${url}`;
        else if (e.currentTarget.getAttribute("data-social") === "line")
          return `https://line.me/R/msg/text/?${txt} ${url}`;
        return "";
      };
      window.open(
        url(room.title, `https://lt-space.abelab.dev/explore/${roomId}`),
        "",
        "width=580,height=400,menubar=no,toolbar=no,scrollbars=yes"
      );
    };
    return (
      <HStack>
        <Button
          size="40px"
          color="white"
          bg="#1DA1F1"
          borderRadius="50%"
          boxSize="30px"
          _hover={{ bg: "#5AB4F4" }}
          data-social="twitter"
          onClick={onClickShare}
        >
          <FaTwitter />
        </Button>
        <Button
          size="40px"
          color="white"
          bg="#4167B2"
          borderRadius="50%"
          boxSize="30px"
          _hover={{ bg: "#5192F5" }}
          data-social="facebook"
          onClick={onClickShare}
        >
          <FaFacebookF />
        </Button>
        <Button
          size="40px"
          color="white"
          bg="#01B902"
          borderRadius="50%"
          boxSize="30px"
          _hover={{ bg: "#5192F5" }}
          data-social="line"
          onClick={onClickShare}
        >
          <SiLine />
        </Button>
      </HStack>
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

      <Stack maxW={"100vw"}>
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
              <ShareBtns />
            </Flex>
            <Box py="15px" w={"100%"}>
              <Thumbnail imageUrl={room.imageUrl} />
            </Box>

            <Box width="100%" borderBottom="4px" borderColor={"teal.400"}>
              <Heading fontSize="1.5rem" textAlign={"start"}>
                スペース概要
              </Heading>
            </Box>
            {/* TODO: */}
            <Text width="100%" textAlign={"start"}>
              {room.description
                .split("\n")
                .map((str, index) =>
                  str === "" ? <br /> : <p key={index}>{str}</p>
                )}
            </Text>

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
