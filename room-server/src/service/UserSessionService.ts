import { UserSessionModel } from "../model/UserSessionModel";
import { IUserSessionRepository } from "../repository/IUserSessionRepository";

export class UserSessionService {
  private userSessionRepository: IUserSessionRepository;

  /**
   * コンストラクタ
   *
   * @param {IUserSessionRepository} userSessionRepository
   */
  constructor(userSessionRepository: IUserSessionRepository) {
    this.userSessionRepository = userSessionRepository;
  }

  /**
   * ユーザセッションを取得
   *
   * @param {string} socketId
   *
   * @returns ユーザセッション
   */
  async getUserSession(socketId: string): Promise<UserSessionModel | null> {
    return this.userSessionRepository.getBySocketId(socketId);
  }
}
