import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback, useEffect } from "react";
import { socket } from "../hooks/socket";
import { InitialStateParams } from "@api-schema/types/events";
import { RoomMember } from "@api-schema/types/member";

//default微妙かも

/**
 * 直接コンポーネントから参照しない
 * hookを作ってそれを介して使う
 */
export const membersState = atom<RoomMember[]>({
  key: "useSyncMember-membersState",
  default: [],
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

export const useMembersStateValue = () => {
  return useRecoilValue(membersState);
};

export const useSetInitialRoomState = () => {
  const setState = useSetRecoilState(membersState);
  return useCallback(
    (initialStateParams: InitialStateParams) => {
      setState(initialStateParams.members);
    },
    [setState]
  );
};
