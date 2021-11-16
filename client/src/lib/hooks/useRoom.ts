import {
  atom,
  selector,
  selectorFamily,
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import { authJWTState } from "./useAuth";
import client from "../../utils/api-client.factory";
import { RoomResponse } from "@api-schema/api/@types";

export const roomIdState = atom<number | null>({
  key: "useRoom-roomIdState",
  default: null,
});

export const useSetRoomId = () => useSetRecoilState(roomIdState);
export const useRoomId = () => useRecoilValue(roomIdState);

export const roomStateFamily = selectorFamily<RoomResponse | null, number>({
  key: "useRoom-roomState",
  get:
    (roomId) =>
    async ({ get }) => {
      //TODO roomデータは認証不必要にするかも
      const authHeader = get(authJWTState);

      if (!authHeader) return null;

      return await client.api.rooms._room_id(roomId).$get({
        config: {
          headers: authHeader,
        },
      });
    },
});

export const roomState = selector({
  key: "useRoom-roomState",
  get: ({ get }) => {
    const roomId = get(roomIdState);
    if (!roomId) return;
    return get(roomStateFamily(roomId));
  },
});

/**
 * roomInfoを取得
 */
export const useRoom = () => {
  return useRecoilValue(roomState);
};

/**
 * roomInfoを取得
 */
export const useRoomById = (roomId: number) => {
  return useRecoilValue(roomStateFamily(roomId));
};

/**
 * roomInfoのloadableを取得
 */
export const useRoomLoadable = () => {
  return useRecoilValueLoadable(roomState);
};

export const useRefreshRoom = (roomId: number) => {
  return useRecoilRefresher_UNSTABLE(roomStateFamily(roomId));
};
