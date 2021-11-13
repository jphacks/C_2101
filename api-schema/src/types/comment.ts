import { UserId } from "@api-schema/types/user";

export type CommentItem = {
  text: string;
  timestamp: number;
} & (
  | {
      type: "user";
      userId: UserId;
    }
  | {
      type: "system";
    }
);
