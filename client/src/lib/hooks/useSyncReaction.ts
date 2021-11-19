import { atomFamily, useRecoilCallback, useRecoilValue } from "recoil";
import { ReactionItem } from "@api-schema/types/reaction";
import { UserId } from "@api-schema/types/user";
import { useEffect, useRef } from "react";
import { socket } from "./socket";

const reactionState = atomFamily<ReactionItem | null, UserId>({
  key: "useSyncReaction-reactionState",
  default: null,
});

export const useSetReactionHandler = () => {
  const timerRef = useRef<NodeJS.Timeout>();

  const setState = useRecoilCallback(
    ({ set }) =>
      (userId: UserId, reaction: ReactionItem | null) => {
        set(reactionState(userId), reaction);
      }
  );

  useEffect(() => {
    const listener = (reaction: ReactionItem) => {
      console.log("handle broadcastReaction");
      setState(reaction.userId, reaction);

      timerRef.current = setTimeout(() => {
        setState(reaction.userId, null);
      }, 5000);
    };

    socket.on("broadcastReaction", listener);
    return () => {
      socket.off("broadcastReaction", listener);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [setState]);
};

export const useReactionValue = (userId: UserId) => {
  return useRecoilValue(reactionState(userId));
};
