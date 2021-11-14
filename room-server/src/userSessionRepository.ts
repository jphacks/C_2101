import { UserId } from "@api-schema/types/user";

type UserSessionStore = Record<UserId, UserSessionValue>;

export type UserSessionValue = {
  userId: UserId;
  roomId: number;
  socketId: string;
};

interface UserSessionRepository {
  get(userId: UserId): Promise<UserSessionValue | null>;
  set(userId: UserId, value: UserSessionValue): Promise<void>;
}

class TempUserSessionRepository implements UserSessionRepository {
  private userStore: UserSessionStore = {};

  async get(userId: UserId): Promise<UserSessionValue | null> {
    return this.userStore[userId];
  }

  async set(userId: UserId, value: UserSessionValue): Promise<void> {
    this.userStore[userId] = value;
  }
}

export const userSessionRepository: UserSessionRepository =
  new TempUserSessionRepository();
