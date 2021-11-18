import { RoomSessionModel } from "../model/RoomSessionModel";
import { IRoomSessionRepository } from "./IRoomSessionRepository";
import { ReadonlyDeep } from "type-fest";

export class InMemoryRoomSessionRepository implements IRoomSessionRepository {
  private store: Record<number, Readonly<RoomSessionModel>> = {};

  async getByRoomId(
    roomId: number
  ): Promise<Readonly<RoomSessionModel> | null> {
    return this.store[roomId];
  }

  async insert(
    roomId: number,
    roomSession: Readonly<RoomSessionModel>
  ): Promise<void> {
    this.store[roomId] = roomSession;
  }

  async update(
    roomId: number,
    roomSession: Readonly<RoomSessionModel>
  ): Promise<void> {
    this.store[roomId] = roomSession;
  }
}
