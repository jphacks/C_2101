import { UserInfo } from "@api-schema/types/user";

export type TimetableState = {
  cursor:
    | {
        progress: "waitingStart";
      }
    | {
        progress: "inSession";
        currentSession: number;
        currentSection: number;
      }
    | {
        progress: "finished";
      };
  sessions: TimetableSession[];
};

export type TimetableSession = {
  user: UserInfo;
  title: string;
  section: {
    sectionTitle: string;
    lengthSec: number;
  }[];
};
