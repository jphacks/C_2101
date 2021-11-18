import { RoomSessionModel } from "../model/RoomSessionModel";
import { ReadonlyDeep } from "type-fest";

export interface IRoomSessionRepository {
  /**
   * ルームIDからルームセッションを取得
   *
   * @param {number} roomId
   *
   * @returns ルームセッション
   */
  getByRoomId(roomId: number): Promise<Readonly<RoomSessionModel> | null>;

  /**
   * ルームセッションを作成
   *
   * @param {number} roomId
   * @param {RoomSessionModel} roomSession
   */
  insert(
    roomId: number,
    roomSession: Readonly<RoomSessionModel>
  ): Promise<void>;

  /**
   * ルームセッションを更新
   *
   * @param {number} roomId
   * @param {RoomSessionModel} roomSession
   */
  update(
    roomId: number,
    roomSession: Readonly<RoomSessionModel>
  ): Promise<void>;
}
