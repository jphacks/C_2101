import { SkywayCredentialsModel } from "@api-schema/api/@types";
import { CommentItem } from "@api-schema/types/comment";
import { MemberStreamIds, RoomMember } from "@api-schema/types/member";
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
    auth: string,
    credential: EmitResponse<SkywayCredentialsModel>
  ) => void;

  /**
   * カメラ共有用のskywayCredentialを要求
   * ownerとspeakerのみ
   * @param res
   */
  getCameraCredential: (
    auth: string,
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
   * ユーザの画面共有mediaIdをセット
   * @param mediaScreenId
   */
  setUserMediaStream: (streams: Partial<MemberStreamIds>) => void;

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
   * 現在のCommentsを取得
   * @param res
   */
  getCommentsState: (res: EmitResponse<CommentItem[]>) => void;

  /**
   * 現在のTimerStateを取得
   * @param res
   */
  getTimerState: (res: EmitResponse<TimerState>) => void;

  /**
   * 現在のTimetableStateを取得
   * @param res
   */
  getTimetableState: (res: EmitResponse<TimetableState>) => void;

  /**
   * 現在のScreenStateを取得
   * @param res
   */
  getScreenState: (res: EmitResponse<StreamState>) => void;

  /**
   * 現在のMembersを取得
   * @param res
   */
  getMemberState: (res: EmitResponse<RoomMember[]>) => void;
}

export interface ServerToClientsEventsMap {
  /**
   * ルームに入れたことを通知
   */
  joinedRoom: (roomId: number) => void;

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
  updateMembersState: (members: RoomMember[]) => void;
}

type EmitResponse<T> = (res: T) => void;

export type InitialStateParams = {
  comments: CommentItem[];
  timetable: TimetableState;
  timer: TimerState;
  streamState: StreamState;
  members: RoomMember[];
};
