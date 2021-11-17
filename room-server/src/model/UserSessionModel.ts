import { UserId } from "api-schema/src/types/user";

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
