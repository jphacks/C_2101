import { UserResponse } from "@api-schema/api/@types";

export type Timetable = {
  pointer:
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
  user: Omit<UserResponse, "email">;
  title: string;
  section: {
    sectionTitle: string;
    lengthSec: number;
  }[];
};
