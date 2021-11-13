import { RoomMember } from "@api-schema/types/member";

//使わないかも
export type RoomState = {
  roomId: number;
  members: RoomMember[];
};
