import { atom, useResetRecoilState, useSetRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import { useCallback } from "react";
import client from "../utils/api-client.factory";

const { persistAtom } = recoilPersist();

export type AuthHeader = {
  Authorization: string;
};

export const authJWTState = atom<AuthHeader>({
  key: "useAuth-authJWTState",
  default: Promise.reject(),
  effects_UNSTABLE: [persistAtom],
});

const useLoginAction = () => {
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

const useLogoutAction = () => {
  const resetState = useResetRecoilState(authJWTState);
  return resetState;
};
