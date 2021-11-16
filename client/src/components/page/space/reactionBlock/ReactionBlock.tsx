import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import EmojiBtn from "./EmojiBtn";
import EmojiMoreBtn from "./EmojiMoreBtn";

type ConfigBlockProps = {};
const defaultEmojis = Array.from("✋👍👏🙌👋");
export const ReactionBlock: React.VFC<ConfigBlockProps> = ({}) => {
  return (
    <Box bg={"gray.200"} w={"full"} rounded={8}>
      <HStack p={4} justifyContent="space-between">
        {defaultEmojis.map((emoji) => {
          return <EmojiBtn emoji={emoji} key={emoji} />;
        })}
        <EmojiMoreBtn />
      </HStack>
    </Box>
  );
};
