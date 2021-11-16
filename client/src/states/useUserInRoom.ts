import { selector, useRecoilValue } from "recoil";
import { roomState } from "./useRoom";
import { userState } from "./useUser";

const isOwnerInRoomState = selector({
  key: "useRoomUser-isOwnerInRoomState",
  get: ({ get }) => {
    const room = get(roomState);
    const me = get(userState);

    return room.owner.id === me.id;
  },
});

export const useIsOwner = () => {
  return useRecoilValue(isOwnerInRoomState);
};
