import {
  atom,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import { recoilPersist } from "recoil-persist";
import { useCallback } from "react";
import client from "../utils/api-client.factory";

const { persistAtom } = recoilPersist();

export type AuthHeader = {
  Authorization: string;
};

export const authJWTState = atom<AuthHeader | null>({
  key: "useAuth-authJWTState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

type SignupParam = {
  email: string;
  password: string;
  name: string;
  icon: string;
};

export const useLoginAction = () => {
  const setState = useSetRecoilState(authJWTState);

  return useCallback(
    async (loginParam: { email: string; password: string }) => {
      const res = await client.api.login.$post({
        body: loginParam,
      });

      const authValue = `${res.tokenType} ${res.accessToken}`;
      const header = {
        Authorization: authValue,
      };
      setState(header);
      return header;
    },
    [setState]
  );
};

export const useLogoutAction = () => {
  return useResetRecoilState(authJWTState);
};

export const useSignupAction = () => {
  const setState = useSetRecoilState(authJWTState);

  return useCallback(
    async (signupParam: SignupParam) => {
      const res = await client.api.signup.$post({
        body: signupParam,
      });

      const authValue = `${res.tokenType} ${res.accessToken}`;
      const header = {
        Authorization: authValue,
      };
      setState(header);
      return header;
    },
    [setState]
  );
};

export const useAuthHeader = () => {
  return useRecoilValue(authJWTState);
};
