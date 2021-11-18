import { UserSessionModel } from "../model/UserSessionModel";
import { IUserSessionRepository } from "./IUserSessionRepository";
import { ReadonlyDeep } from "type-fest";

export class InMemoryUserSessionRepository implements IUserSessionRepository {
  private store: Record<string, UserSessionModel> = {};

  async getBySocketId(
    socketId: string
  ): Promise<Readonly<UserSessionModel> | null> {
    return this.store[socketId];
  }

  async insert(
    socketId: string,
    userSession: Readonly<UserSessionModel>
  ): Promise<void> {
    this.store[socketId] = userSession;
  }

  async delete(socketId: string): Promise<void> {
    delete this.store[socketId];
  }
}
