import { Timetable } from "./timetable";
import { TimerState } from "@api-schema/types/timerState";

export type SkywayDataCommon = {
  timestamp: number;
};

export type SkywayData = SkywayDataCommon &
  (
    | ReactionText
    | ReactionEmoji
    | RequestPresentation
    | ResponsePresentation
    | UpdateAllowList
    | UpdateTimer
    | UpdateTimetable
    | RequestTimetable
  );

export type ReactionText = {
  type: "reactionText";
  text: string;
};

export type ReactionEmoji = {
  type: "reactionEmoji";
  emoji: string;
};

export type RequestPresentation = {
  type: "requestPresentation";
  userId: string;
  index: number;
};

export type ResponsePresentation = {
  type: "responsePresentation";
} & (
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: string;
    }
);

export type UpdateAllowList = {
  type: "updateAllowList";
  video: string[];
  audio: string[];
};

export type UpdateTimer = {
  type: "updateTimer";
  timer: TimerState;
};

export type UpdateTimetable = {
  type: "updateTimetable";
  timetable: Timetable;
};

export type RequestTimetable = {
  type: "requestTimetable";
};
