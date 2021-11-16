import { selector, useRecoilValue } from "recoil";
import { authJWTState } from "./useAuth";
import client from "../../utils/api-client.factory";

const roomListState = selector({
  key: "useRoomList-roomListState",
  get: async ({ get }) => {
    const auth = get(authJWTState);

    if (!auth) return null;

    const res = await client.api.rooms.$get({
      config: {
        headers: auth,
      },
    });

    return res.rooms;
  },
});

export const useRoomList = () => {
  return useRecoilValue(roomListState);
};
