export type CommentItem = {
  text: string;
  timestamp: number;
} & (
  | {
      type: "user";
      userId: string;
    }
  | {
      type: "system";
    }
);
