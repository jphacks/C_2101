import { CommentBlock } from "./CommentBlock";
import {
  useCommentsAction,
  useCommentsPropsValue,
} from "../../../../states/useSyncComment";
import React, { useCallback } from "react";
import { CommentItem } from "@api-schema/types/comment";
import { useUser } from "../../../../states/useUser";

export const CommentBlockContainer: React.VFC = () => {
  const { postComment } = useCommentsAction();
  const comments = useCommentsPropsValue();
  const { id: userId } = useUser();

  const handleSubmit = useCallback(
    (text: string) => {
      const comment: CommentItem = {
        type: "user",
        userId: userId,
        text: text,
        timestamp: Date.now(),
      };
      postComment(comment);
    },
    [postComment, userId]
  );

  return <CommentBlock comments={comments} onSubmit={handleSubmit} />;
};
