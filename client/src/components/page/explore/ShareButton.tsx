import { Button, HStack } from "@chakra-ui/react";
import React from "react";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { SiLine } from "react-icons/si";
//import type * as Types from "../../../api/@types";

type Props = {
  room: any; //Types.RoomResponse;
};
export const ShareBtns: React.VFC<Props> = ({ room }) => {
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
      url(room.title, `https://lt-space.abelab.dev/explore/${room.id}`),
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
        _hover={{ bg: "#55C74C" }}
        data-social="line"
        onClick={onClickShare}
      >
        <SiLine />
      </Button>
    </HStack>
  );
};
