import { RoomMember } from "@api-schema/types/member";
import { StreamState } from "@api-schema/types/streamState";
import { CommentItem } from "api-schema/src/types/comment";
import { TimerState } from "api-schema/src/types/timerState";
import { TimetableState } from "api-schema/src/types/timetableState";

type RoomSessionStore = Record<number, RoomSessionValue>;
export type RoomSessionValue = {
  comments: CommentItem[];
  timetable: TimetableState;
  timer: TimerState;
  members: RoomMember[];
  streamState: StreamState;
};

interface RoomSessionRepository {
  get(roomId: number): Promise<RoomSessionValue | null>;
  set(roomId: number, value: RoomSessionValue): Promise<void>;
}

class TempRoomSessionRepository implements RoomSessionRepository {
  private roomStore: RoomSessionStore = {};

  async get(roomId: number): Promise<RoomSessionValue | null> {
    return this.roomStore[roomId];
  }

  async set(roomId: number, value: RoomSessionValue): Promise<void> {
    this.roomStore[roomId] = value;
  }
}

export const roomSessionRepository: RoomSessionRepository =
  new TempRoomSessionRepository();
