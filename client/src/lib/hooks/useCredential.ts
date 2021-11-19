import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { SkywayCredentialsModel } from "@api-schema/api/@types";

const listenCredentialState = atom<SkywayCredentialsModel | null>({
  key: "useSkywayCredential-listenCredentialState",
  default: null,
});

const cameraCredentialState = atom<SkywayCredentialsModel | null>({
  key: "useSkywayCredential-cameraCredentialState",
  default: null,
});

const screenShareCredentialState = atom<SkywayCredentialsModel | null>({
  key: "useSkywayCredential-screenShareCredentialState",
  default: null,
});

export const useSetListenCredential = () => {
  return useSetRecoilState(listenCredentialState);
};

export const useSetCameraCredential = () => {
  return useSetRecoilState(cameraCredentialState);
};

export const useSetScreenCredential = () => {
  return useSetRecoilState(screenShareCredentialState);
};

export const useListenCredentialValue = () => {
  return useRecoilValue(listenCredentialState);
};

export const useCameraCredentialValue = () => {
  return useRecoilValue(cameraCredentialState);
};

export const useScreenCredentialValue = () => {
  return useRecoilValue(screenShareCredentialState);
};

//setCredentialでcredentialをストアし接続
//
