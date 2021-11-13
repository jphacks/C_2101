import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { TimerState } from "@api-schema/types/timerState";
import { useCallback, useEffect, useState } from "react";
import { socket } from "./socket";
import { calcTimerSec } from "@api-schema/lib/timer";

const timerState = atom<TimerState>({
  key: "timerState",
  default: {
    timerEnabled: false,
    accTime: 0,
  },
});

const useSetTimerHandler = () => {
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

type Action =
  | {
      type: "reset";
      enable: boolean;
    }
  | {
      type: "pause";
    }
  | {
      type: "resume";
    };

const timerStateReducer = (state: TimerState, action: Action): TimerState => {
  switch (action.type) {
    case "reset":
      if (action.enable) {
        return {
          timerEnabled: true,
          startTime: Date.now(),
          accTime: 0,
        };
      } else {
        return {
          timerEnabled: false,
          accTime: 0,
        };
      }
    case "pause":
      if (state.timerEnabled) {
        return {
          timerEnabled: false,
          accTime: Date.now() - state.startTime,
        };
      } else {
        return state;
      }
    case "resume":
      if (state.timerEnabled) {
        return state;
      } else {
        return {
          timerEnabled: true,
          startTime: Date.now(),
          accTime: state.accTime,
        };
      }
  }
};

const useTimerAction = () => {
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

const useTimerElapsedSec = () => {
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

const useTimerRemainSec = (fullSec: number) => {
  const elapsedSec = useTimerElapsedSec();
  return fullSec - elapsedSec;
};
