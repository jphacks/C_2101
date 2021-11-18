import { UserSessionModel } from "../model/UserSessionModel";
import { ReadonlyDeep } from "type-fest";

export interface IUserSessionRepository {
  /**
   * ソケットIDからユーザセッションを取得
   *
   * @param {string} socketId
   *
   * @returns ユーザセッション
   */
  getBySocketId(socketId: string): Promise<Readonly<UserSessionModel> | null>;

  /**
   * ユーザセッションを作成
   *
   * @param {string} socketId
   * @param {UserSessionModel} userSession
   */
  insert(
    socketId: string,
    userSession: Readonly<UserSessionModel>
  ): Promise<void>;

  /**
   * ユーザセッションを削除
   *
   * @param {string} socketId
   */
  delete(socketId: string): Promise<void>;
}
