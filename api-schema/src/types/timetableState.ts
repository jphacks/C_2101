import { UserId } from "@api-schema/types/user";

export type TimetableState = {
  cursor: TimetableCursor;
  sections: TimetableSection[];
};

export type TimetableCursor =
  | {
      progress: "waitingStart";
    }
  | {
      progress: "section";
      index: number;
    }
  | {
      progress: "betweenSection";
      prevIndex: number;
      nextIndex: number;
    }
  | {
      progress: "finished";
    };

export type TimetableSection = {
  userId: UserId;
  sessionTitle: string;
  sectionTitle: string;
  estimateTimeMs: number;
};
