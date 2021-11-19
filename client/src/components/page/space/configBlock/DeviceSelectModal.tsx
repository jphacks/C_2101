import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  VStack,
} from "@chakra-ui/react";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useAsync } from "react-use";
import { getNavigator } from "../../../../lib/navigator";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialAudioDeviceId?: string;
  initialVideoDeviceId?: string;
  onSelectedAudioDevice: (deviceId: string) => void;
  onSelectedVideoDevice: (deviceId: string) => void;
};

export const DeviceSelectModal: React.VFC<Props> = ({
  isOpen,
  onClose,
  initialAudioDeviceId,
  initialVideoDeviceId,
  onSelectedAudioDevice,
  onSelectedVideoDevice,
}) => {
  const [audioOptions, setAudioOptions] = useState<MediaDeviceInfo[]>();
  const [videoOptions, setVideoOptions] = useState<MediaDeviceInfo[]>();

  useAsync(async () => {
    const navi = getNavigator();
    if (!navi) return;
    const devices = await navi.mediaDevices.enumerateDevices();
    setAudioOptions(devices.filter((device) => device.kind === "audioinput"));
    setVideoOptions(devices.filter((device) => device.kind === "videoinput"));
  }, []);

  const [selectedAudioId, setSelectedAudioId] = useState<string | undefined>(
    initialAudioDeviceId
  );
  const [selectedVideoId, setSelectedVideoId] = useState<string | undefined>(
    initialVideoDeviceId
  );

  const handleOnChangeAudio = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const device = audioOptions?.find(
        (info) => info.deviceId === event.target.value
      );
      setSelectedAudioId(device?.deviceId);
    },
    [audioOptions]
  );

  const handleOnChangeVideo = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const device = videoOptions?.find(
        (info) => info.deviceId === event.target.value
      );
      setSelectedVideoId(device?.deviceId);
    },
    [videoOptions]
  );

  const handleClickOk = useCallback(() => {
    if (selectedAudioId) {
      onSelectedAudioDevice(selectedAudioId);
    }
    if (selectedVideoId) {
      onSelectedVideoDevice(selectedVideoId);
    }
    onClose();
  }, [
    onClose,
    onSelectedAudioDevice,
    onSelectedVideoDevice,
    selectedAudioId,
    selectedVideoId,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <VStack>
            <FormControl id="audioDevice">
              <FormLabel>マイク</FormLabel>
              <Select onChange={handleOnChangeAudio} value={selectedAudioId}>
                {audioOptions?.map((device) => (
                  <option value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="videoDevice">
              <FormLabel>カメラ</FormLabel>
              <Select onChange={handleOnChangeVideo} value={selectedVideoId}>
                {videoOptions?.map((device) => (
                  <option value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleClickOk}>
            OK
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
