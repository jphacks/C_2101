import { UserSessionModel } from "../model/UserSessionModel";

export interface IUserSessionRepository {
  /**
   * ソケットIDからユーザセッションを取得
   *
   * @param {string} socketId
   *
   * @returns ユーザセッション
   */
  getBySocketId(socketId: string): Promise<UserSessionModel | null>;

  /**
   * ユーザセッションを作成
   *
   * @param {string} socketId
   * @param {UserSessionModel} userSession
   */
  insert(socketId: string, userSession: UserSessionModel): Promise<void>;
}
