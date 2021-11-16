import { Box, HStack } from "@chakra-ui/react";
import React, { useCallback } from "react";
import EmojiBtn from "./EmojiBtn";
import EmojiMoreBtn from "./EmojiMoreBtn";

type ConfigBlockProps = {
  onEmojiSubmit: (emoji: string) => void;
};

const defaultEmojis = Array.from("✋👍👏🙌👋");

export const ReactionBlock: React.VFC<ConfigBlockProps> = ({
  onEmojiSubmit,
}) => {
  const handleClickEmoji = useCallback(
    (emoji: string) => () => {
      onEmojiSubmit(emoji);
    },
    [onEmojiSubmit]
  );

  return (
    <Box bg={"gray.200"} w={"full"} rounded={8}>
      <HStack p={4} justifyContent="space-between">
        {defaultEmojis.map((emoji) => {
          return (
            <EmojiBtn
              emoji={emoji}
              onClick={handleClickEmoji(emoji)}
              key={emoji}
            />
          );
        })}
        <EmojiMoreBtn />
      </HStack>
    </Box>
  );
};
