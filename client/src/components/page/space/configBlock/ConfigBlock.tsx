import {
  Icon,
  Box,
  HStack,
  Switch,
  StackDivider,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { ChangeEvent, useCallback } from "react";
import VolumeHighIcon from "mdi-react/VolumeHighIcon";
import MicrophoneIcon from "mdi-react/MicrophoneIcon";
import VideocamIcon from "mdi-react/VideocamIcon";

type ConfigBlockProps = {
  micValue: boolean;
  cameraValue: boolean;
  onChangeMicValue: (value: boolean) => void;
  onChangeCameraValue: (value: boolean) => void;
};

export const ConfigBlock: React.VFC<ConfigBlockProps> = ({
  micValue,
  cameraValue,
  onChangeMicValue,
  onChangeCameraValue,
}) => {
  const handleChangeMic = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChangeMicValue(event.target.checked);
    },
    [onChangeMicValue]
  );

  const handleChangeCamera = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChangeCameraValue(event.target.checked);
    },
    [onChangeCameraValue]
  );
  const [MediaQuery] = useMediaQuery("(min-width: 1300px)");
  const IconSize = MediaQuery ? 8 : 4;
  const ToggleSize = MediaQuery ? "lg" : "md";
  const Height = MediaQuery ? "80px" : "70px";

  return (
    <Box bg={"gray.200"} w={"full"} rounded={8} minWidth={0}>
      <HStack
        p={IconSize / 2}
        minWidth={0}
        w={"full"}
        justify="space-around"
        divider={<StackDivider borderColor={"gray.400"} />}
      >
        <HStack rounded={4} py={2} bg={"gray.200"} gridGap={1}>
          <Icon
            w={IconSize}
            h={IconSize}
            as={(props) => <MicrophoneIcon {...props} />}
          />
          <Switch
            isChecked={micValue}
            onChange={handleChangeMic}
            size={ToggleSize}
            colorScheme={"teal"}
          />
        </HStack>
        <HStack rounded={4} p={2} bg={"gray.200"} gridGap={1}>
          <Icon
            w={IconSize}
            h={IconSize}
            as={(props) => <VolumeHighIcon {...props} />}
          />
          <Switch size={ToggleSize} colorScheme={"teal"} />
        </HStack>
        <HStack rounded={4} p={2} bg={"gray.200"} gridGap={1}>
          <Icon
            w={IconSize}
            h={IconSize}
            as={(props) => <VideocamIcon {...props} />}
          />
          <Switch
            isChecked={cameraValue}
            onChange={handleChangeCamera}
            size={ToggleSize}
            colorScheme={"teal"}
          />
        </HStack>
        {/*<IconButton*/}
        {/*  aria-label={"setting"}*/}
        {/*  bg={"gray.200"}*/}
        {/*  icon={*/}
        {/*    <Icon w={8} h={8} as={(props) => <SettingsIcon {...props} />} />*/}
        {/*  }*/}
        {/*/>*/}
      </HStack>
    </Box>
  );
};
