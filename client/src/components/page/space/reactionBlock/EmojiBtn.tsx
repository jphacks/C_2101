import { Box } from "@chakra-ui/react";
import React, { useState, useCallback } from "react";
import { Twemoji } from "../../../common/Emoji/Twemoji";
import { shake } from "../../../common/Emoji/shakeCSSkyeframe";

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
