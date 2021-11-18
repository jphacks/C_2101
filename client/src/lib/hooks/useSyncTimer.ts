import {
  atom,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { TimerState } from "@api-schema/types/timerState";
import { useCallback, useEffect, useState } from "react";
import { socket } from "./socket";
import { calcTimerSec, timerStateReducer } from "@api-schema/lib/timer";

/**
 * 直接コンポーネントから参照しない
 * hookを作ってそれを介して使う
 */
export const timerState = atom<TimerState>({
  key: "useSyncTimer-timerState",
  default: new Promise((resolve) => {
    socket.once("joinedRoom", () => {
      socket.emit("getTimerState", (res) => {
        console.log("set default timer state", res);
        resolve(res);
      });
    });
  }),
});

export const useSetTimerHandler = () => {
  const setState = useSetRecoilState(timerState);

  useEffect(() => {
    const listener = (timer: TimerState) => {
      setState(timer);
    };

    socket.on("updateTimer", listener);
    return () => {
      socket.off("updateTimer", listener);
    };
  }, [setState]);
};

export const useTimerAction = () => {
  const timer = useRecoilValue(timerState);
  //ここで権限チェック入れた方がいいかも？
  const hasPermission = true;

  const reset = useCallback(
    (stop: boolean) => {
      if (!hasPermission) return;
      const nextState = timerStateReducer(timer, {
        type: "reset",
        enable: stop,
      });
      socket.emit("setTimer", nextState);
    },
    [hasPermission, timer]
  );

  const pause = useCallback(() => {
    if (!hasPermission) return;
    const nextState = timerStateReducer(timer, {
      type: "pause",
    });
    socket.emit("setTimer", nextState);
  }, [hasPermission, timer]);

  const resume = useCallback(() => {
    if (!hasPermission) return;
    const nextState = timerStateReducer(timer, {
      type: "resume",
    });
    socket.emit("setTimer", nextState);
  }, [hasPermission, timer]);

  return {
    reset,
    pause,
    resume,
  };
};

export const useTimerElapsedSec = () => {
  const timer = useRecoilValue(timerState);
  const [second, setSecond] = useState<number>(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSecond(calcTimerSec(timer));
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [timer]);

  return second;
};

export const useTimerRemainSec = (fullSec: number) => {
  const elapsedSec = useTimerElapsedSec();
  return fullSec - elapsedSec;
};

export const useTimerIsEnabled = () => {
  const value = useRecoilValue(timerState);
  return value.timerEnabled;
};

export const useRefreshTimer = () => {
  return useRecoilCallback(({ set }) => () => {
    socket.emit("getTimerState", (res) => {
      set(timerState, res);
    });
  });
};
