import { Box, HStack } from "@chakra-ui/react";
import React from "react";
// import VolumeHighIcon from "mdi-react/VolumeHighIcon";
import EmojiBtn from "../../common/Emoji/EmojiBtn";
import EmojiMoreBtn from "../../common/Emoji/EmojiMoreBtn";

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
