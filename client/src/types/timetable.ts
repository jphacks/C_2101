import { UserResponse } from "../api/@types";

export type Timetable = {
  pointer:
    | {
        inSession: false;
      }
    | {
        inSession: true;
        current: number;
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
