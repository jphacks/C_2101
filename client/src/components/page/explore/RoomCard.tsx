import {
  Avatar,
  Flex,
  Stack,
  Spacer,
  Text,
  Link,
  Heading,
  Box,
  Image,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import type * as Types from "../../../api/@types";
import { transform } from "../../../utils/datetime";

type Props = {
  room: Types.RoomResponse;
};

type ThumbnailProps = {
  imageUrl: string;
};
const Thumbnail: React.VFC<ThumbnailProps> = ({ imageUrl }) => {
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
      <></>
    );
  return (
    <Box borderRadius={5} width="150px" bg="gray.200">
      <Img />
    </Box>
  );
};
const RoomCard: React.FC<Props> = ({ room }) => {
  const participants: number = room.speakers.length + room.viewers.length;

  return (
    <Stack width="750px">
      <Flex height="100px">
        <Thumbnail imageUrl={room.imageUrl} />
        <Flex paddingLeft={3} flex="1" direction="column">
          <Flex>
            <Heading as="u" fontSize={"1.3rem"} textAlign={"start"}>
              <NextLink href={`/explore/${room.id}`} passHref>
                <Link>{room.title}</Link>
              </NextLink>
            </Heading>
            <Spacer />
            <Text fontSize={"0.7rem"} color={"#999999"} fontWeight="bold">
              開催日: {transform(new Date(room.startAt), "YYYY/MM/DD")}
            </Text>
          </Flex>
          <Text
            fontSize={"0.9rem"}
            color={"#999999"}
            fontWeight="bold"
            textAlign={"start"}
          >
            {room.description.slice(0, 70)}
            {room.description.length > 70 ? "..." : ""}
          </Text>
          <Flex marginTop="auto">
            <Flex align={"center"}>
              <Avatar size={"xs"} src={room.owner.iconUrl} />
              <Text fontSize={"0.8rem"} marginLeft="10px" fontWeight="bold">
                {room.owner.name}
              </Text>
            </Flex>
            <Spacer />
            <Text fontSize={"0.8rem"}>参加者: {participants}人</Text>
          </Flex>
        </Flex>
      </Flex>
    </Stack>
  );
};

export default RoomCard;
