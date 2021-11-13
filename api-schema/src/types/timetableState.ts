import { UserId } from "@api-schema/types/user";

export type TimetableState = {
  cursor: number;
  sections: TimetableSection[];
};

export type TimetableSection =
  | SpeakingSection
  | PreparationSection
  | BetweenSection
  | CloseSection;

export type SpeakingSection = {
  type: "speaking";
  userId: UserId;
  sessionTitle: string;
  sectionTitle: string;
  estimateTimeSec: number;
};

export type PreparationSection = {
  type: "startPreparation";
};

export type BetweenSection = {
  type: "between";
};

export type CloseSection = {
  type: "closed";
};
