import { RoomResponse, SkywayCredentialsModel } from "@api-schema/api/@types";
import { UserInfo } from "@api-schema/types/user";
import produce from "immer";

import { RoomMemberFactory } from "../factory/RoomMemberFactory";
import { RoomSessionFactory } from "../factory/RoomSessionFactory";
import { IRoomSessionRepository } from "../repository/IRoomSessionRepository";
import { IUserSessionRepository } from "../repository/IUserSessionRepository";

export class RoomSessionService {
  private roomSessionRepository: IRoomSessionRepository;
  private userSessionRepository: IUserSessionRepository;
  private roomMemberFactory: RoomMemberFactory;
  private roomSessionFactory: RoomSessionFactory;

  /**
   * コンストラクタ
   *
   * @param {IRoomSessionRepository} roomSessionRepository
   * @param {IUserSessionRepository} userSessionRepository
   * @param {RoomMemberFactory} roomMemberFactory
   * @param {RoomSessionFactory} roomSessionFactory
   */
  constructor(
    roomSessionRepository: IRoomSessionRepository,
    userSessionRepository: IUserSessionRepository,
    roomMemberFactory: RoomMemberFactory,
    roomSessionFactory: RoomSessionFactory
  ) {
    this.roomSessionRepository = roomSessionRepository;
    this.userSessionRepository = userSessionRepository;
    this.roomMemberFactory = roomMemberFactory;
    this.roomSessionFactory = roomSessionFactory;
  }

  /**
   * ユーザがルームに入室
   *
   * @param {UserInfo} user
   * @param {string} socketId
   * @param {RoomResponse} room
   * @param {SkywayCredentialsModel} credential
   */
  async userJoinRoom(
    user: UserInfo,
    socketId: string,
    room: RoomResponse,
    credential: SkywayCredentialsModel
  ): Promise<void> {
    // ルームセッションを取得（存在しなければ初期化）
    const roomSession =
      (await this.roomSessionRepository.getByRoomId(room.id)) ??
      this.roomSessionFactory.create(room);

    // ルームメンバーを作成
    const roomMember = this.roomMemberFactory.create(
      user,
      socketId,
      room,
      credential
    );

    // ルームセッションを作成
    await this.roomSessionRepository.insert(
      room.id,
      produce(roomSession, (draft) => {
        draft.members
          .filter(
            (item) =>
              !(
                item.connection.isOnline &&
                item.connection.socketId === socketId
              )
          )
          .push(roomMember);
      })
    );

    // ユーザセッションを作成
    await this.userSessionRepository.insert(socketId, {
      userId: user.id,
      isGuest: false,
      roomId: room.id,
      socketId: socketId,
    });
  }
}
