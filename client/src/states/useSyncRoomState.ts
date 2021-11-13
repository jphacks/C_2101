import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { RoomState } from "@api-schema/types/roomState";
import { useEffect } from "react";
import { socket } from "../hooks/socket";

//default微妙かも

const roomState = atom<RoomState>({
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
