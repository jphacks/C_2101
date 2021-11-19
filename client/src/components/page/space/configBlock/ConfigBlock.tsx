import {
  Icon,
  Box,
  HStack,
  Switch,
  StackDivider,
  useMediaQuery,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import React, { ChangeEvent, useCallback } from "react";
import MicrophoneIcon from "mdi-react/MicrophoneIcon";
import VideocamIcon from "mdi-react/VideocamIcon";
import CogIcon from "mdi-react/CogIcon";

type ConfigBlockProps = {
  micValue: boolean;
  cameraValue: boolean;
  onChangeMicValue: (value: boolean) => void;
  onChangeCameraValue: (value: boolean) => void;
  onClickPreference: () => void;
  micDisabled: boolean;
  cameraDisabled: boolean;
};

export const ConfigBlock: React.VFC<ConfigBlockProps> = ({
  micValue,
  cameraValue,
  onChangeMicValue,
  onChangeCameraValue,
  onClickPreference,
  micDisabled,
  cameraDisabled,
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

  return (
    <Box bg={"gray.200"} w={"full"} rounded={8} minWidth={0}>
      <HStack
        p={IconSize / 2}
        minWidth={0}
        w={"full"}
        justify="space-around"
        divider={<StackDivider borderColor={"gray.400"} px={1} />}
      >
        <Tooltip
          hasArrow
          label={"現在の発表者以外は変更できません"}
          placement={"top"}
          isDisabled={!micDisabled}
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
              isDisabled={micDisabled}
              size={ToggleSize}
              colorScheme={"teal"}
            />
          </HStack>
        </Tooltip>

        <Tooltip
          hasArrow
          label={"現在の発表者以外は変更できません"}
          placement={"top"}
          isDisabled={!cameraDisabled}
        >
          <HStack rounded={4} p={2} bg={"gray.200"} gridGap={1}>
            <Icon
              w={IconSize}
              h={IconSize}
              as={(props) => <VideocamIcon {...props} />}
            />
            <Switch
              isChecked={cameraValue}
              onChange={handleChangeCamera}
              isDisabled={cameraDisabled}
              size={ToggleSize}
              colorScheme={"teal"}
            />
          </HStack>
        </Tooltip>
        {/*<HStack rounded={4} p={2} bg={"gray.200"} gridGap={1}>*/}
        {/*  <Icon w={8} h={8} as={(props) => <VolumeHighIcon {...props} />} />*/}
        {/*  <Switch size={"lg"} colorScheme={"teal"} />*/}
        {/*</HStack>*/}

        <IconButton
          aria-label={"setting"}
          bg={"gray.200"}
          onClick={onClickPreference}
          icon={
            <Icon
              w={IconSize}
              h={IconSize}
              as={(props) => <CogIcon {...props} />}
            />
          }
        />
      </HStack>
    </Box>
  );
};
