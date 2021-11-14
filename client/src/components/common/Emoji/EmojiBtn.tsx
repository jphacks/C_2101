import { Box } from "@chakra-ui/react";
import React from "react";
// import VolumeHighIcon from "mdi-react/VolumeHighIcon";

type ConfigBlockProps = {};
const EmojiBtn: React.VFC<{ emoji: string }> = ({ emoji }) => {
  return (
    <Box
      fontSize="28px"
      cursor="pointer"
      rounded="full"
      boxSize="42px"
      //   _hover={{ bg: "#CBD5E0" }}
      //   transitionDuration=".5s"
      textAlign="center"
    >
      {emoji}
    </Box>
  );
};
export default EmojiBtn;
