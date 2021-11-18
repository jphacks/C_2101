import {
  RoomResponse,
  SkywayCredentialsModel,
} from "api-schema/src/api/@types";
import { TimerState } from "api-schema/src/types/timerState";
import { TimetableState } from "api-schema/src/types/timetableState";
import { UserInfo } from "api-schema/src/types/user";
import { CommentItem } from "api-schema/src/types/comment";
import produce from "immer";

import { RoomSessionModel } from "../model/RoomSessionModel";
import { RoomMemberFactory } from "../factory/RoomMemberFactory";
import { RoomSessionFactory } from "../factory/RoomSessionFactory";
import { IRoomSessionRepository } from "../repository/IRoomSessionRepository";
import { IUserSessionRepository } from "../repository/IUserSessionRepository";
import { UserId } from "@api-schema/types/user";
import { MemberStreamIds } from "@api-schema/types/member";

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

    const newRoom = produce(roomSession, (draft) => {
      draft.members = draft.members.filter(
        (item) =>
          !(item.user.id === user.id) &&
          !(item.connection.isOnline && item.connection.socketId === socketId)
      );
      draft.members.push(roomMember);
    });

    // ルームセッションを作成
    await this.roomSessionRepository.insert(room.id, newRoom);

    // ユーザセッションを作成
    await this.userSessionRepository.insert(socketId, {
      userId: user.id,
      isGuest: false,
      roomId: room.id,
      socketId: socketId,
    });
  }

  /**
   * ルームから退出する
   *
   * @param {string} socketId
   */
  async leaveRoom(socketId: string): Promise<void> {
    await this.userSessionRepository.delete(socketId);
  }

  /**
   * ユーザのstreamIdをセット
   * @param streams
   * @param socketId
   * @param userId
   */
  async setMemberStream(
    streams: MemberStreamIds,
    socketId: string,
    userId: UserId
  ): Promise<void> {
    const roomId = await this.getRoomIdBySocketId(socketId);
    const roomSession = await this.getRoomSessionBySocketId(socketId);
    if (!roomId || !roomSession) {
      return;
    }

    const roomSessionMembers = roomSession.members.map((member) =>
      produce(member, (draft) => {
        if (member.user.id !== userId) return;
        if (draft.type !== "Speaker" || !draft.connection.isOnline) return;
        draft.connection.streamIds = streams;
      })
    );

    await this.roomSessionRepository.update(roomId, {
      ...roomSession,
      members: roomSessionMembers,
    });
  }

  /**
   * 現在の発表者のstreamIdをRoomのStreamStateにセットする
   * @param socketId
   */
  async mutateRoomStream(socketId: string): Promise<void> {
    const roomId = await this.getRoomIdBySocketId(socketId);
    const roomSession = await this.getRoomSessionBySocketId(socketId);
    if (!roomId || !roomSession) {
      return;
    }

    const updatedRoomSession = produce(roomSession, (draft) => {
      const currentSection = draft.timetable.sections[draft.timetable.cursor];
      if (!currentSection || currentSection.type !== "speaking") {
        draft.streamState = {
          focusVideoStreamId: null,
          focusScreenStreamId: null,
        };
        return;
      }

      const currentSectionMember = draft.members.find(
        (member) => member.user.id === currentSection.userId
      );
      if (!currentSectionMember || !currentSectionMember.connection.isOnline) {
        draft.streamState = {
          focusVideoStreamId: null,
          focusScreenStreamId: null,
        };
        return;
      }

      draft.streamState = {
        focusVideoStreamId:
          currentSectionMember.connection.streamIds.videoStreamId,
        focusScreenStreamId:
          currentSectionMember.connection.streamIds.screenStreamId,
      };
    });

    await this.roomSessionRepository.update(roomId, updatedRoomSession);
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
    await this.roomSessionRepository.update(
      roomId,
      produce(roomSession, (draft) => {
        draft.timetable = timetable;
      })
    );
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
    await this.roomSessionRepository.update(
      roomId,
      produce(roomSession, (draft) => {
        draft.timer = timer;
      })
    );
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
  ): Promise<Readonly<RoomSessionModel> | null> {
    return this.getRoomSessionBySocketId(socketId);
  }

  /**
   * コメントを投稿する
   *
   * @param {CommentItem} comment
   * @param {string} socketId
   */
  async postComment(comment: CommentItem, socketId: string): Promise<void> {
    // ルーム情報を取得
    const roomId = await this.getRoomIdBySocketId(socketId);
    const roomSession = await this.getRoomSessionBySocketId(socketId);
    if (!roomId || !roomSession) {
      return;
    }

    // コメント情報を追加
    await this.roomSessionRepository.update(
      roomId,
      produce(roomSession, (draft) => {
        draft.comments.push(comment);
      })
    );
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
  ): Promise<Readonly<RoomSessionModel> | null> {
    // ユーザセッションを取得
    const userSession = await this.userSessionRepository.getBySocketId(
      socketId
    );
    if (!userSession) {
      return null;
    }

    // ルームセッションを取得
    return await this.roomSessionRepository.getByRoomId(userSession.roomId);
  }
}
