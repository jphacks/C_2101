import { ConfigBlock } from "./ConfigBlock";
import React from "react";
import {
  useAudioDeviceID,
  useCameraDeviceID,
  useCameraEnabled,
  useMicEnabled,
  useSetAudioDeviceId,
  useSetCameraDeviceId,
  useSetCameraEnabled,
  useSetMicEnabled,
} from "../../../../lib/hooks/useStreamConfig";
import { useIsCurrentOwnSession } from "../../../../lib/hooks/useSyncTimetable";
import { useDisclosure } from "@chakra-ui/react";
import { DeviceSelectModal } from "./DeviceSelectModal";

export const ConfigBlockContainer: React.VFC = () => {
  const cameraValue = useCameraEnabled();
  const micValue = useMicEnabled();
  const setCameraValue = useSetCameraEnabled();
  const setMicValue = useSetMicEnabled();

  const isOwnSession = useIsCurrentOwnSession();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialAudioDeviceId = useAudioDeviceID();
  const initialVideoDeviceId = useCameraDeviceID();
  const setAudioDeviceId = useSetAudioDeviceId();
  const setVideoDeviceId = useSetCameraDeviceId();

  const handleSelectedAudioDevice = (deviceId: string) => {
    console.log(deviceId);
    setAudioDeviceId(deviceId);
  };

  const handleSelectedVideoDevice = (deviceId: string) => {
    console.log(deviceId);
    setVideoDeviceId(deviceId);
  };

  return (
    <>
      <ConfigBlock
        cameraValue={cameraValue}
        micValue={micValue}
        onChangeCameraValue={setCameraValue}
        onChangeMicValue={setMicValue}
        onClickPreference={() => {
          onOpen();
        }}
        micDisabled={!isOwnSession}
        cameraDisabled={!isOwnSession}
      />
      <DeviceSelectModal
        isOpen={isOpen}
        onClose={onClose}
        initialAudioDeviceId={initialAudioDeviceId ?? undefined}
        initialVideoDeviceId={initialVideoDeviceId ?? undefined}
        onSelectedAudioDevice={handleSelectedAudioDevice}
        onSelectedVideoDevice={handleSelectedVideoDevice}
      />
    </>
  );
};
