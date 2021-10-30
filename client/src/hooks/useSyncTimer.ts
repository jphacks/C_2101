import { MutableRefObject, useEffect, useState } from "react";
import { Timer } from "../types/timer";
import { SkywayData } from "../types/skywayData";
import { RoomData, SfuRoom } from "skyway-js";
import { Member } from "./useRoom";

const createTimestamp = () => Date.now();

type UserTimerParam = {
  isOwner: boolean;
  roomRef: MutableRefObject<SfuRoom | undefined>;
  memberFetcher: (peerId: string) => Member | undefined;
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

const timerStateReducer = (state: Timer, action: Action): Timer => {
  console.log("reducer");
  console.log(state);
  console.log(action);
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

export const useSyncTimer = ({
  isOwner,
  roomRef,
  memberFetcher,
}: UserTimerParam) => {
  //かなり変則的ではある
  const [state, setState] = useState<Timer>({
    timerEnabled: false,
    accTime: 0,
  });

  const sendTimer = (value?: Timer) => {
    const data: SkywayData = {
      type: "updateTimer",
      timestamp: createTimestamp(),
      timer: value ?? state,
    };
    roomRef.current?.send(data);
    if (roomRef.current) {
      console.log("sendTimer", data);
    }
  };

  const reset = (enable: boolean) => {
    setState((prevState) => {
      const nextState = timerStateReducer(prevState, {
        type: "reset",
        enable: enable,
      });
      if (isOwner) {
        sendTimer(nextState);
      }
      return nextState;
    });
  };

  const pause = () => {
    setState((prevState) => {
      const nextState = timerStateReducer(prevState, {
        type: "pause",
      });
      if (isOwner) {
        sendTimer(nextState);
      }
      return nextState;
    });
  };

  const resume = () => {
    setState((prevState) => {
      const nextState = timerStateReducer(prevState, {
        type: "resume",
      });
      if (isOwner) {
        sendTimer(nextState);
      }
      return nextState;
    });
  };

  const calcTimerSec = (now?: number) => {
    if (state.timerEnabled) {
      console.log(state);
      return Math.floor(
        ((now ?? Date.now()) - state.startTime + state.accTime) / 1000
      );
    } else {
      return Math.floor(state.accTime / 1000);
    }
  };

  const calcRemainTimerSec = (fullSec: number, now?: number) => {
    return fullSec - calcTimerSec(now);
  };

  useEffect(() => {
    const room = roomRef.current;
    if (!room) return;
    console.log("init timer");

    const listener = (param: RoomData) => {
      const member = memberFetcher(param.src);
      const data = param.data as SkywayData;
      if (data.type === "updateTimer" && member && member.isOwner) {
        setState(data.timer);
      }
    };
    room.on("data", listener);
    return () => {
      room.off("data", listener);
    };
  });

  return {
    state,
    timerAction: {
      reset,
      pause,
      resume,
    },
    calcTimerSec,
    calcRemainTimerSec,
  };
};
