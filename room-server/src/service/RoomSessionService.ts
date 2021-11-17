import {
  RoomResponse,
  SkywayCredentialsModel,
} from "api-schema/src/api/@types";
import { TimerState } from "api-schema/src/types/timerState";
import { TimetableState } from "api-schema/src/types/timetableState";
import { UserInfo } from "api-schema/src/types/user";
import produce from "immer";

import { RoomSessionModel } from "../model/RoomSessionModel";
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

  /**
   * ルームのタイマーをセットする
   *
   * @param {TimetableState} timetable
   * @param {string} socketId
   */
  async setTimetable(
    timetable: TimetableState,
    socketId: string
  ): Promise<void> {
    // ルーム情報を取得
    const roomId = await this.getRoomIdBySocketId(socketId);
    const roomSession = await this.getRoomSessionBySocketId(socketId);
    if (!roomId || !roomSession) {
      return;
    }

    // タイムテーブルを更新
    roomSession.timetable = timetable;
    await this.roomSessionRepository.update(roomId, roomSession);
  }

  /**
   * ルームのタイマーをセットする
   *
   * @param {TimerState} timer
   * @param {string} socketId
   */
  async setTimer(timer: TimerState, socketId: string): Promise<void> {
    // ルーム情報を取得
    const roomId = await this.getRoomIdBySocketId(socketId);
    const roomSession = await this.getRoomSessionBySocketId(socketId);
    if (!roomId || !roomSession) {
      return;
    }

    // タイマーを更新
    roomSession.timer = timer;
    await this.roomSessionRepository.update(roomId, roomSession);
  }

  /**
   * 参加中のルームセッションを取得する
   *
   * @param {string} socketId
   *
   * @returns ルームセッション
   */
  async getActiveRoomSession(
    socketId: string
  ): Promise<RoomSessionModel | null> {
    return this.getRoomSessionBySocketId(socketId);
  }

  /**
   * ソケットIDから参加してるルームIDを取得
   *
   * @param {string} socketId
   *
   * @returns ルームID
   */
  private async getRoomIdBySocketId(socketId: string): Promise<number | null> {
    // ユーザセッションを取得
    const userSession = await this.userSessionRepository.getBySocketId(
      socketId
    );
    if (userSession === null) {
      return null;
    }

    return userSession.roomId;
  }

  /**
   * ソケットIDから参加しているルームセッションを取得
   *
   * @param {string} socketId
   *
   * @returns ルームセッション
   */
  private async getRoomSessionBySocketId(
    socketId: string
  ): Promise<RoomSessionModel | null> {
    // ユーザセッションを取得
    const userSession = await this.userSessionRepository.getBySocketId(
      socketId
    );
    if (userSession === null) {
      return null;
    }

    // ルームセッションを取得
    const roomSession = await this.roomSessionRepository.getByRoomId(
      userSession.roomId
    );
    return roomSession;
  }
}
