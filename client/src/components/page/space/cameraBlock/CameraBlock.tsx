import React from "react";
import {
  Avatar,
  Box,
  chakra,
  HStack,
  Icon,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { UserInfo } from "@api-schema/types/user";
import MicrophoneIcon from "mdi-react/MicrophoneIcon";
import VideocamIcon from "mdi-react/VideocamIcon";
import MicrophoneOffIcon from "mdi-react/MicrophoneOffIcon";
import VideocamOffIcon from "mdi-react/VideocamOffIcon";

type Props = {
  srcRef: React.RefObject<HTMLVideoElement>;
  muted?: boolean;
  user?: UserInfo;
  isAudioEnabled: boolean;
  isCameraEnabled: boolean;
};

const Video = chakra("video");

export const CameraBlock: React.VFC<Props> = ({
  srcRef,
  muted,
  user,
  isCameraEnabled,
  isAudioEnabled,
}) => {
  return (
    <Box bg={"gray.200"} w={"full"} rounded={8} p={2}>
      <VStack align={"end"}>
        <Box h={"full"} m="auto">
          <Video
            w={"100%"}
            h={"150px"}
            ref={srcRef}
            muted={muted}
            rounded={8}
          />
        </Box>
        <HStack w={"full"} px={2}>
          {user && <Avatar name={user.name} src={user.iconUrl} size={"sm"} />}
          <Text fontSize={"xl"}>{user?.name}</Text>
          <Spacer />
          {isAudioEnabled ? (
            <Icon w={8} h={8} as={(props) => <MicrophoneIcon {...props} />} />
          ) : (
            <Icon
              w={8}
              h={8}
              as={(props) => <MicrophoneOffIcon {...props} />}
            />
          )}
          {isCameraEnabled ? (
            <Icon w={8} h={8} as={(props) => <VideocamIcon {...props} />} />
          ) : (
            <Icon w={8} h={8} as={(props) => <VideocamOffIcon {...props} />} />
          )}
        </HStack>
      </VStack>
    </Box>
  );
};
