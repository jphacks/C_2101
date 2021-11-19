// const

import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

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

const { persistAtom } = recoilPersist();
const cameraDeviceIdState = atom<string | null>({
  key: "useStreamConfig-cameraDeviceState",
  default: navigator.mediaDevices
    .enumerateDevices()
    .then(
      (devices) =>
        devices.find((device) => device.kind === "videoinput")?.deviceId ?? null
    ),
  effects_UNSTABLE: [persistAtom],
});

const audioDeviceIdState = atom<string | null>({
  key: "useStreamConfig-audioDeviceState",
  default: navigator.mediaDevices
    .enumerateDevices()
    .then(
      (devices) =>
        devices.find((device) => device.kind === "audioinput")?.deviceId ?? null
    ),
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
