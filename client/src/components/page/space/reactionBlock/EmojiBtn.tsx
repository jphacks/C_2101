import { Box, keyframes } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Twemoji from "../../../common/Emoji/Twemoji";

const shake = keyframes`
  0% {
    transform: translateX(0);
  }

  6.5% {
    transform: translateX(-6px) rotateY(-9deg) rotateZ(-9deg);
  }

  18.5% {
    transform: translateX(5px) rotateY(7deg) rotateZ(7deg);
  }

  31.5% {
    transform: translateX(-3px) rotateY(-5deg) rotateZ(-5deg);
  }

  43.5% {
    transform: translateX(2px) rotateY(3deg) rotateZ(3deg);
  }

  50% {
    transform: translateX(0);
  }
}
`;

type Props = {
  emoji: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};
const EmojiBtn: React.VFC<Props> = ({ emoji, onClick = () => {} }) => {
  const [isAnime, setAnime] = useState<boolean>(true);

  const animation = isAnime ? undefined : `${shake} 1 0.8s ease-in-out`;
  const click = (e: React.MouseEvent<HTMLDivElement>, emoji: string) => {
    console.log(emoji);
    onClick(e);
    setAnime(true);
    setTimeout(() => setAnime(false));
  };
  return (
    <Box
      animation={animation}
      fontSize="28px"
      cursor="pointer"
      rounded="full"
      boxSize="42px"
      //   _hover={{ bg: "#CBD5E0" }}
      //   transitionDuration=".5s"
      textAlign="center"
      onClick={(e) => click(e, emoji)}
    >
      <Twemoji emoji={emoji} />
    </Box>
  );
};
export default EmojiBtn;
