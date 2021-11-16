import { RoomSessionModel } from "../model/RoomSessionModel";

export interface IRoomSessionRepository {
  /**
   * ルームIDからルームセッションを取得
   *
   * @param {number} roomId
   *
   * @returns ルームセッション
   */
  getByRoomId(roomId: number): Promise<RoomSessionModel | null>;

  /**
   * ルームセッションを作成
   *
   * @param {number} roomId
   * @param {RoomSessionModel} roomSession
   */
  insert(roomId: number, roomSession: RoomSessionModel): Promise<void>;
}
