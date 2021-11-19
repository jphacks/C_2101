import React from "react";
import { Box, chakra, VStack } from "@chakra-ui/react";

type Props = {
  srcRef: React.RefObject<HTMLVideoElement>;
  muted?: boolean;
  menu?: React.ReactElement;
};

const Video = chakra("video");

export const ScreenBlock: React.VFC<Props> = ({ srcRef, muted, menu }) => {
  return (
    <VStack
      rounded={8}
      p={4}
      bg={"gray.200"}
      w={"full"}
      h={"full"}
      textAlign={"center"}
    >
      <Video w={"full"} h={"full"} ref={srcRef} muted={muted} rounded={8} />
      {menu}
    </VStack>
  );
};
