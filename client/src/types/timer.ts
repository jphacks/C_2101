export type Timer =
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
