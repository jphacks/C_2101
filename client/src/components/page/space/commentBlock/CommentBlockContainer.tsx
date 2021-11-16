import { CommentBlock } from "./CommentBlock";
import {
  useCommentsAction,
  useCommentsPropsValue,
} from "../../../../lib/hooks/useSyncComment";
import React, { useCallback } from "react";
import { CommentItem } from "@api-schema/types/comment";
import { useUser } from "../../../../lib/hooks/useUser";

export const CommentBlockContainer: React.VFC = () => {
  const { postComment } = useCommentsAction();
  const comments = useCommentsPropsValue();
  const user = useUser();

  const handleSubmit = useCallback(
    (text: string) => {
      if (!user) return;

      const comment: CommentItem = {
        type: "user",
        userId: user.id,
        text: text,
        timestamp: Date.now(),
      };
      postComment(comment);
    },
    [postComment, user]
  );

  return <CommentBlock comments={comments} onSubmit={handleSubmit} />;
};
