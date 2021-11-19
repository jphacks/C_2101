// const

import { atom, useRecoilValue, useSetRecoilState } from "recoil";

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
