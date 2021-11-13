import { TimerState } from "@api-schema/types/timerState";

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

export const timerStateReducer = (
  state: TimerState,
  action: Action
): TimerState => {
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

export const calcTimerSec = (timer: TimerState, now?: number) => {
  if (timer.timerEnabled) {
    return Math.floor(
      ((now ?? Date.now()) - timer.startTime + timer.accTime) / 1000
    );
  } else {
    return Math.floor(timer.accTime / 1000);
  }
};
