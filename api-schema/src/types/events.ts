import { SkywayCredentialsModel } from "@api-schema/api/@types";
import { CommentItem } from "@api-schema/types/comment";
import { ReactionItem } from "@api-schema/types/reaction";
import { RoomState } from "@api-schema/types/roomState";
import { TimerState } from "@api-schema/types/timerState";
import { TimetableState } from "@api-schema/types/timetableState";

//socket.ioのイベント型

export interface ClientToServerEventsMap {
  /**
   * ビデオ通話用のskywayCredentialを要求
   * @param res
   */
  getVideotelephonyCredential: (
    credential: EmitResponse<SkywayCredentialsModel>
  ) => void;

  /**
   * 画面共有用のskywayCredentialを要求
   * ownerとspeakerのみ
   * @param res
   */
  getScreenCredential: (
    credential: EmitResponse<SkywayCredentialsModel>
  ) => void;

  /**
   * コメントを投稿
   * @param comment
   */
  postComment: (comment: CommentItem) => void;

  /**
   * リアクションを投稿
   * @param reaction
   */
  postReaction: (reaction: ReactionItem) => void;

  /**
   * 画面共有を開始する
   * ownerとspeakerのみ
   * @param mediaScreenId
   */
  startScreenShare: (mediaScreenId: string) => void;

  /**
   * タイムテーブルをセット
   * ownerのみ
   * @param timetable
   */
  setTimetable: (timetable: TimetableState) => void;

  /**
   * タイマーをセット
   * @param timer
   */
  setTimer: (timer: TimerState) => void;

  /**
   * 各種状態を全て取得
   */
  getInitialStatus: (
    res: EmitResponse<{
      comments: CommentItem[];
      timetable: TimetableState;
      timer: TimerState;
      roomState: RoomState;
    }>
  ) => void;
}

export interface ServerToClientsEventsMap {
  /**
   * 投稿されたコメントを配信
   * @param comment
   */
  broadcastComment: (comment: CommentItem) => void;

  /**
   * 投稿されたリアクションを配信
   * @param reaction
   */
  broadcastReaction: (reaction: ReactionItem) => void;

  /**
   * タイムテーブルの更新
   * @param timetable
   */
  updateTimetable: (timetableState: TimetableState) => void;

  /**
   * タイマーの更新
   * @param timer
   */
  updateTimer: (timerState: TimerState) => void;

  /**
   * ルームステートの更新
   * @param roomState
   */
  updateRoomState: (roomState: RoomState) => void;
}

type EmitResponse<T> = (res: T) => void;
