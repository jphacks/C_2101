import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { CommentItem } from "@api-schema/types/comment";
import { socket } from "./socket";
import { useCallback, useEffect } from "react";

const commentsState = atom<CommentItem[]>({
  key: "commentsState",
  default: [],
});

const useSetCommentsHandler = () => {
  const setState = useSetRecoilState(commentsState);

  useEffect(() => {
    const listener = (commentItem: CommentItem) => {
      setState((prev) => {
        return [...prev, commentItem];
      });
    };

    socket.on("broadcastComment", listener);
    return () => {
      socket.off("broadcastComment", listener);
    };
  }, [setState]);
};

const useCommentsAction = () => {
  const postComment = useCallback((commentItem: CommentItem) => {
    socket.emit("postComment", commentItem);
  }, []);

  return {
    postComment,
  };
};

const useCommentsValue = () => {
  return useRecoilValue(commentsState);
};
