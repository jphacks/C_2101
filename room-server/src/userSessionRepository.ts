import { UserId } from "@api-schema/types/user";

type UserSessionStore = Record<string, UserSessionValue>;

export type UserSessionValue = {
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

interface UserSessionRepository {
  get(socketId: string): Promise<UserSessionValue | null>;
  set(socketId: string, value: UserSessionValue): Promise<void>;
}

class TempUserSessionRepository implements UserSessionRepository {
  private userStore: UserSessionStore = {};

  async get(socketId: string): Promise<UserSessionValue | null> {
    return this.userStore[socketId];
  }

  async set(socketId: string, value: UserSessionValue): Promise<void> {
    this.userStore[socketId] = value;
  }
}

export const userSessionRepository: UserSessionRepository =
  new TempUserSessionRepository();
