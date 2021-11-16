import {
  atom,
  selector,
  selectorFamily,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import { authJWTState } from "./useAuth";
import client from "../utils/api-client.factory";
import { RoomResponse } from "@api-schema/api/@types";

export const roomIdState = atom<number>({
  key: "useRoom-roomIdState",
  default: Promise.reject(),
});

export const useSetRoomId = () => useSetRecoilState(roomIdState);
export const useRoomId = () => useRecoilValue(roomIdState);

export const roomState = selector<RoomResponse>({
  key: "useRoom-roomState",
  get: async ({ get }) => {
    //TODO roomデータは認証不必要にするかも
    const authHeader = get(authJWTState);
    const roomId = get(roomIdState);

    return await client.api.rooms._room_id(roomId).$get({
      config: {
        headers: authHeader,
      },
    });
  },
});

/**
 * roomInfoを取得
 * ログインしていない場合などはエラーをthrowする
 */
export const useRoom = () => {
  return useRecoilValue(roomState);
};

/**
 * roomInfoのloadableを取得
 */
export const useRoomLoadable = () => {
  return useRecoilValueLoadable(roomState);
};
