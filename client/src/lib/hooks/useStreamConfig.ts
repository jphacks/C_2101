// const

import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import { getNavigator } from "../navigator";

const cameraEnableState = atom<boolean>({
  key: "useStreamConfig-cameraEnableState",
  default: false,
});

const micEnableState = atom<boolean>({
  key: "useStreamConfig-micEnableState",
  default: false,
});

export const useCameraEnabled = () => {
  return useRecoilValue(cameraEnableState);
};

export const useMicEnabled = () => {
  return useRecoilValue(micEnableState);
};

export const useSetCameraEnabled = () => {
  return useSetRecoilState(cameraEnableState);
};

export const useSetMicEnabled = () => {
  return useSetRecoilState(micEnableState);
};

const getDefaultCameraDeviceId = async () => {
  const navi = getNavigator();
  if (!navi) return null;
  const devices = await navi.mediaDevices.enumerateDevices();
  return (
    devices.find((device) => device.kind === "videoinput")?.deviceId ?? null
  );
};
const { persistAtom } = recoilPersist();
const cameraDeviceIdState = atom<string | null>({
  key: "useStreamConfig-cameraDeviceState",
  default: getDefaultCameraDeviceId(),
  effects_UNSTABLE: [persistAtom],
});

const getDefaultAudioDeviceId = async () => {
  const navi = getNavigator();
  if (!navi) return null;
  const devices = await navi.mediaDevices.enumerateDevices();
  return (
    devices.find((device) => device.kind === "audioinput")?.deviceId ?? null
  );
};
const audioDeviceIdState = atom<string | null>({
  key: "useStreamConfig-audioDeviceState",
  default: getDefaultAudioDeviceId(),
  effects_UNSTABLE: [persistAtom],
});

export const useCameraDeviceID = () => {
  return useRecoilValue(cameraDeviceIdState);
};

export const useAudioDeviceID = () => {
  return useRecoilValue(audioDeviceIdState);
};

export const useSetCameraDeviceId = () => {
  return useSetRecoilState(cameraDeviceIdState);
};

export const useSetAudioDeviceId = () => {
  return useSetRecoilState(audioDeviceIdState);
};

const audioDeviceParamState = selector({
  key: "useStreamConfig-audioDeviceParamState",
  get: ({ get }) => {
    const deviceEnable = get(micEnableState);
    const deviceId = get(audioDeviceIdState);
    if (deviceEnable && deviceId) {
      return {
        deviceId: deviceId,
      };
    } else {
      return deviceEnable;
    }
  },
});

export const useAudioDeviceParam = () => {
  return useRecoilValue(audioDeviceParamState);
};

const cameraDeviceParamState = selector({
  key: "useStreamConfig-cameraDeviceParamState",
  get: ({ get }) => {
    const deviceEnable = get(cameraEnableState);
    const deviceId = get(cameraDeviceIdState);
    if (deviceEnable && deviceId) {
      return {
        deviceId: deviceId,
      };
    } else {
      return deviceEnable;
    }
  },
});

export const useCameraDeviceParam = () => {
  return useRecoilValue(cameraDeviceParamState);
};
