import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import { CommentItem } from "@api-schema/types/comment";
import { socket } from "./socket";
import { useCallback, useEffect } from "react";
import { memberMapState } from "./useSyncMembers";
import { CommentProps } from "../../components/page/space/commentBlock/CommentItem";

/**
 * 直接コンポーネントから参照しない
 * hookを作ってそれを介して使う
 */
export const commentsState = atom<CommentItem[]>({
  key: "useSyncComment-commentsState",
  default: new Promise((resolve) => {
    socket.once("joinedRoom", () => {
      socket.emit("getCommentsState", (res) => {
        console.log("set default comments state", res);
        resolve(res);
      });
    });
  }),
});

export const useSetCommentsHandler = () => {
  const valueLoadable = useRecoilValueLoadable(commentsState);
  const setState = useSetRecoilState(commentsState);

  useEffect(() => {
    const listener = (commentItem: CommentItem) => {
      // await valueLoadable.toPromise();
      setState((prev) => {
        return [...prev, commentItem];
      });
    };

    socket.on("broadcastComment", listener);
    return () => {
      socket.off("broadcastComment", listener);
    };
  }, [setState, valueLoadable]);
};

export const useCommentsAction = () => {
  const postComment = useCallback((commentItem: CommentItem) => {
    socket.emit("postComment", commentItem);
  }, []);

  return {
    postComment,
  };
};

export const useCommentsValue = () => {
  return useRecoilValue(commentsState);
};

export const useRefreshComments = () => {
  return useRecoilCallback(({ set }) => () => {
    socket.emit("getCommentsState", (res) => {
      set(commentsState, res);
    });
  });
};

const commentsPropsState = selector<CommentProps[]>({
  key: "useSyncComment-commentsPropsState",
  get: ({ get }) => {
    const memberMap = get(memberMapState);
    const commentsRaw = get(commentsState);
    return commentsRaw.map((item) => {
      if (item.type === "user") {
        return {
          ...item,
          type: "user",
          user: memberMap[item.userId].user,
        };
      } else {
        return item;
      }
    });
  },
});

export const useCommentsPropsValue = () => {
  return useRecoilValue(commentsPropsState);
};
