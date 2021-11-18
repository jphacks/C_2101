import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { useEffect } from "react";
import { socket } from "./socket";
import { RoomMember } from "@api-schema/types/member";
import { UserId } from "@api-schema/types/user";

//default微妙かも

/**
 * 直接コンポーネントから参照しない
 * hookを作ってそれを介して使う
 */
export const membersState = atom<RoomMember[]>({
  key: "useSyncMember-membersState",
  default: new Promise((resolve) => {
    socket.once("joinedRoom", () => {
      socket.emit("getMemberState", (res) => {
        console.log("set default member state", res);
        resolve(res);
      });
    });
  }),
});

export const useSetRoomStateHandler = () => {
  const setState = useSetRecoilState(membersState);

  useEffect(() => {
    const listener = (members: RoomMember[]) => {
      setState(members);
    };

    socket.on("updateMembersState", listener);
    return () => {
      socket.off("updateMembersState", listener);
    };
  }, [setState]);
};

export const useMembersValue = () => {
  return useRecoilValue(membersState);
};

export const useRefreshMembers = () => {
  return useRecoilCallback(({ set }) => () => {
    socket.emit("getMemberState", (res) => {
      set(membersState, res);
    });
  });
};

export const memberMapState = selector({
  key: "useSyncMembers-memberMapState",
  get: ({ get }) => {
    const members = get(membersState);
    return members.reduce((acc, next) => {
      return {
        ...acc,
        [next.user.id]: next,
      };
    }, {} as Record<UserId, RoomMember>);
  },
});

export const useMemberMap = () => {
  return useRecoilValue(memberMapState);
};
