import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import EmojiBtn from "./EmojiBtn";
import EmojiMoreBtn from "./EmojiMoreBtn";

type ConfigBlockProps = {
  onEmojiSubmit: (emoji: string) => void;
};

const defaultEmojis = Array.from("✋👍👏🙌👋");

export const ReactionBlock: React.VFC<ConfigBlockProps> = ({
  onEmojiSubmit,
}) => {
  return (
    <Box bg={"gray.200"} w={"full"} rounded={8} minWidth={0}>
      <HStack p={4} justifyContent="space-between">
        {defaultEmojis.map((emoji) => {
          return (
            <EmojiBtn emoji={emoji} onClickEmoji={onEmojiSubmit} key={emoji} />
          );
        })}
        <EmojiMoreBtn onClickEmoji={onEmojiSubmit} />
      </HStack>
    </Box>
  );
};
