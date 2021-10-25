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
  remainSec: number;
  section: string;
};

export type UpdateTimetable = {
  type: "updateTimetable";
  remainSec: number;
  section: string;
};