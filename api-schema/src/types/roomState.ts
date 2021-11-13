import { RoomMember } from "@api-schema/types/member";

export type RoomState = {
  roomId: number;
  members: RoomMember[];
  focusStreamId: string;
};
