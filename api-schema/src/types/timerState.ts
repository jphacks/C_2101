export type TimerState =
  | {
      timerEnabled: false;
      accTime: number;
    }
  | {
      timerEnabled: true;
      //unix millisecond
      startTime: number;
      accTime: number;
    };
