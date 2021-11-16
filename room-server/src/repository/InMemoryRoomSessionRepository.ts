import { RoomSessionModel } from "../model/RoomSessionModel";
import { IRoomSessionRepository } from "./IRoomSessionRepository";

export class InMemoryRoomSessionRepository implements IRoomSessionRepository {
  private store: Record<number, RoomSessionModel> = {};

  async getByRoomId(roomId: number): Promise<RoomSessionModel | null> {
    return this.store[roomId];
  }

  async insert(roomId: number, roomSession: RoomSessionModel): Promise<void> {
    this.store[roomId] = roomSession;
  }
}
