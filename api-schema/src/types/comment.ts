import { UserId } from "@api-schema/types/user";

export type CommentItem = CommentCommonInfo &
  (CommentTypeUser | CommentTypeSystem);

export type CommentCommonInfo = {
  text: string;
  timestamp: number;
};

export type CommentTypeUser = {
  type: "user";
  userId: UserId;
};

export type CommentTypeSystem = {
  type: "system";
};
