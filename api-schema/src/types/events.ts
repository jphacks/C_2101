import { SkywayCredentialsModel } from "@api-schema/api/@types";
import { CommentItem } from "@api-schema/types/comment";
import { RoomMember } from "@api-schema/types/member";
import { ReactionItem } from "@api-schema/types/reaction";
import { StreamState } from "@api-schema/types/streamState";
import { TimerState } from "@api-schema/types/timerState";
import { TimetableState } from "@api-schema/types/timetableState";
import { UserId } from "@api-schema/types/user";

//socket.ioのイベント型

export interface ClientToServerEventsMap {
  /**
   * ルームに参加登録済みユーザとして入室する
   * @param param
   * @param res
   */
  joinRoomAsUser: (
    param: {
      roomId: number;
      auth: string;
      userId: UserId;
    },
    res: EmitResponse<
      | { status: "success"; credential: SkywayCredentialsModel }
      | { status: "failure"; reason: string }
    >
  ) => void;

  /**
   * ルームにゲストとして入室する
   * @param param
   * @param res
   */
  joinRoomAsGuest: (
    param: {
      roomId: number;
    },
    res: EmitResponse<
      | { status: "success"; credential: SkywayCredentialsModel }
      | { status: "failure"; reason: string }
    >
  ) => void;

  /**
   * ルームから退室する
   */
  leaveRoom: () => void;

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
  getInitialStates: (res: EmitResponse<InitialStateParams>) => void;
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
   * 画面共有などの状態更新
   * @param roomState
   */
  updateStreamState: (streamState: StreamState) => void;

  /**
   * メンバーの状態更新
   * @param roomState
   */
  updateRoomState: (roomState: StreamState) => void;
}

type EmitResponse<T> = (res: T) => void;

export type InitialStateParams = {
  comments: CommentItem[];
  timetable: TimetableState;
  timer: TimerState;
  streamState: StreamState;
  members: RoomMember[];
};
