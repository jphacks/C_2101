import { UserId } from "@api-schema/types/user";

export type UserSessionModel = {
  roomId: number;
  socketId: string;
} & (
  | {
      isGuest: true;
    }
  | {
      isGuest: false;
      userId: UserId;
    }
);
