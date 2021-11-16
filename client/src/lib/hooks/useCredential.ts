import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { SkywayCredentialsModel } from "@api-schema/api/@types";

const videotelephonyCredentialState = atom<SkywayCredentialsModel | null>({
  key: "useSkywayCredential-videotelephonyCredentialState",
  default: null,
});

const screenShareCredentialState = atom<SkywayCredentialsModel | null>({
  key: "useSkywayCredential-screenShareCredentialState",
  default: null,
});

export const useSetVideoCredential = () => {
  return useSetRecoilState(videotelephonyCredentialState);
};

export const useSetScreenCredential = () => {
  return useSetRecoilState(screenShareCredentialState);
};

export const useVideoCredentialValue = () => {
  return useRecoilValue(videotelephonyCredentialState);
};

export const useScreenCredentialValue = () => {
  return useRecoilValue(screenShareCredentialState);
};

//setCredentialでcredentialをストアし接続
//
