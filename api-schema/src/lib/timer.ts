import { TimerState } from "@api-schema/types/timerState";

export const calcTimerSec = (timer: TimerState, now?: number) => {
  if (timer.timerEnabled) {
    return Math.floor(
      ((now ?? Date.now()) - timer.startTime + timer.accTime) / 1000
    );
  } else {
    return Math.floor(timer.accTime / 1000);
  }
};
