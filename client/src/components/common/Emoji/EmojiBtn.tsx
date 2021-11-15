import { Box } from "@chakra-ui/react";
import React from "react";
// import VolumeHighIcon from "mdi-react/VolumeHighIcon";
import Twemoji from "./Twemoji";
type ConfigBlockProps = {};

const EmojiBtn: React.VFC<{
  emoji: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}> = ({ emoji, onClick = () => {} }) => {
  return (
    <Box
      fontSize="28px"
      cursor="pointer"
      rounded="full"
      boxSize="42px"
      //   _hover={{ bg: "#CBD5E0" }}
      //   transitionDuration=".5s"
      textAlign="center"
      onClick={(e) => {
        {
          alert(emoji);
          onClick(e);
        }
      }}
    >
      <Twemoji emoji={emoji} />
    </Box>
  );
};
export default EmojiBtn;
