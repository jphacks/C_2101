import { CommentItem } from "@api-schema/types/comment";

//socket.ioのイベント型

export interface ClientToServerEventsMap {
  /**
   * コメントを投稿
   * @param comment
   */
  postComment: (
    comment: CommentItem,
    res: (status: "ok" | "reject") => void
  ) => void;
}

export interface ServerToClientsEventsMap {
  /**
   * 投稿されたコメントを配信
   */
  updatePostedComment: (
    comment: CommentItem,
    res: (status: "ok" | "reject") => void
  ) => void;
}
