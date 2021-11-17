import { RoomMember } from "api-schema/src/types/member";
import { StreamState } from "api-schema/src/types/streamState";
import { CommentItem } from "api-schema/src/types/comment";
import { TimerState } from "api-schema/src/types/timerState";
import { TimetableState } from "api-schema/src/types/timetableState";

export type RoomSessionModel = {
  comments: CommentItem[];
  timetable: TimetableState;
  timer: TimerState;
  members: RoomMember[];
  streamState: StreamState;
};
