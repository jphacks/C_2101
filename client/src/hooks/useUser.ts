import { selector, useRecoilValue, useRecoilValueLoadable } from "recoil";
import client from "../utils/api-client.factory";
import { authJWTState } from "./useAuth";

export const userState = selector({
  key: "useUser-userState",
  get: async ({ get }) => {
    const authHeader = get(authJWTState);
    if (!authHeader) return null;

    return await client.api.users.me.$get({
      config: {
        headers: authHeader,
      },
    });
  },
});

/**
 * userを取得
 * ログインしていない場合などはエラーをthrowする
 */
export const useUser = () => {
  return useRecoilValue(userState);
};

/**
 * userのloadableを取得
 */
export const useUserLoadable = () => {
  return useRecoilValueLoadable(userState);
};
