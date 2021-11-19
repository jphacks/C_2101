import React from "react";
import { Box, chakra } from "@chakra-ui/react";

type Props = {
  srcRef: React.RefObject<HTMLVideoElement>;
  muted?: boolean;
  menu?: React.ReactElement;
};

const Video = chakra("video");

export const CameraBlock: React.VFC<Props> = ({ srcRef, muted, menu }) => {
  return (
    <Box bg={"gray.200"} w={"100%"} h={64} rounded={8} p={2}>
      <Video w={"full"} h={"full"} ref={srcRef} muted={muted} rounded={8} />
      {menu}
    </Box>
  );
};
