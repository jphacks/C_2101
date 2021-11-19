import React, { useCallback } from "react";
import { useSubmitReaction } from "../../../../lib/hooks/useSyncReaction";
import { ReactionBlock } from "./ReactionBlock";
import { useUser } from "../../../../lib/hooks/useUser";
import { ReactionItem } from "@api-schema/types/reaction";

export const ReactionBlockContainer: React.VFC = () => {
  const submitReaction = useSubmitReaction();
  const user = useUser();

  const handleSubmitEmoji = useCallback(
    (emoji: string) => {
      if (!user) return;
      const reaction: ReactionItem = {
        emoji: emoji,
        userId: user.id,
        timestamp: Date.now(),
      };
      submitReaction(reaction);
    },
    [submitReaction, user]
  );

  return <ReactionBlock onEmojiSubmit={handleSubmitEmoji} />;
};
