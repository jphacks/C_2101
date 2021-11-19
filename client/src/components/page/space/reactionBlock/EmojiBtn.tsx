import { Box, keyframes } from "@chakra-ui/react";
import React, { useState, useCallback } from "react";
import { Twemoji } from "../../../common/Emoji/Twemoji";

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
`;

type Props = {
  emoji: string;
  onClickEmoji: (emoji: string) => void;
};
const EmojiBtn: React.VFC<Props> = ({ emoji, onClickEmoji }) => {
  const [isDuringAnime, setDuringAnime] = useState<boolean>(true);

  const animation = isDuringAnime ? undefined : `${shake} 1 0.8s ease-in-out`;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onClickEmoji(emoji);
      setDuringAnime(true);
      setTimeout(() => {
        setDuringAnime(false);
      });
    },
    [emoji, onClickEmoji]
  );

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
      onClick={handleClick}
    >
      <Twemoji emoji={emoji} />
    </Box>
  );
};
export default EmojiBtn;
