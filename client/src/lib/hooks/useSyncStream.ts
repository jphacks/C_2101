import { StreamState } from "@api-schema/types/streamState";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { socket } from "./socket";
import { useEffect, useMemo } from "react";

export const streamState = atom<StreamState>({
  key: "useSyncStream-streamState",
  default: new Promise((resolve) => {
    socket.once("joinedRoom", () => {
      socket.emit("getScreenState", (res) => {
        console.log("set default screen state", res);
        resolve(res);
      });
    });
  }),
});

export const useSetStreamHandler = () => {
  const setState = useSetRecoilState(streamState);

  useEffect(() => {
    const listener = (streams: StreamState) => {
      console.log("handle updateStreamState", streams);
      setState(streams);
    };

    socket.on("updateStreamState", listener);
    return () => {
      socket.off("updateStreamState", listener);
    };
  }, [setState]);
};

export const useStreamValue = () => {
  return useRecoilValue(streamState);
};

const videoStreamIdState = selector({
  key: "useSyncStream-videoStreamIdState",
  get: ({ get }) => get(streamState).focusVideoStreamId,
});
export const useVideoStreamId = () => {
  return useRecoilValue(videoStreamIdState);
};

const screenStreamIdState = selector({
  key: "useSyncStream-screenStreamIdState",
  get: ({ get }) => get(streamState).focusScreenStreamId,
});
export const useScreenStreamId = () => {
  return useRecoilValue(screenStreamIdState);
};
