import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { RoomState } from "@api-schema/types/roomState";
import { useCallback, useEffect } from "react";
import { socket } from "../hooks/socket";
import { InitialStateParams } from "@api-schema/types/events";

//default微妙かも

/**
 * 直接コンポーネントから参照しない
 * hookを作ってそれを介して使う
 */
export const roomState = atom<RoomState>({
  key: "useSyncRoomState-roomState",
  default: {
    roomId: -1,
    members: [],
    focusStreamId: null,
  },
});

export const useSetRoomStateHandler = () => {
  const setState = useSetRecoilState(roomState);

  useEffect(() => {
    const listener = (roomState: RoomState) => {
      setState(roomState);
    };

    socket.on("updateRoomState", listener);
    return () => {
      socket.off("updateRoomState", listener);
    };
  }, [setState]);
};

export const useRoomStateValue = () => {
  return useRecoilValue(roomState);
};

export const useSetInitialRoomState = () => {
  const setState = useSetRecoilState(roomState);
  return useCallback(
    (initialStateParams: InitialStateParams) => {
      setState(initialStateParams.roomState);
    },
    [setState]
  );
};
