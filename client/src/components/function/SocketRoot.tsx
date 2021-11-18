import React, { useEffect } from "react";
import {
  useRefreshComments,
  useSetCommentsHandler,
} from "../../lib/hooks/useSyncComment";
import {
  useRefreshTimer,
  useSetTimerHandler,
} from "../../lib/hooks/useSyncTimer";
import {
  useRefreshTimetable,
  useSetTimetableHandler,
} from "../../lib/hooks/useSyncTimetable";
import {
  useRefreshMembers,
  useSetRoomStateHandler,
} from "../../lib/hooks/useSyncMembers";
import { socket } from "../../lib/hooks/socket";
import { UserInfo } from "@api-schema/types/user";
import { selector } from "recoil";

type SocketRootProps = {
  children: React.ReactNode;
  roomId: number;
  userParam: UserParam;
};

export type UserParam =
  | {
      type: "user";
      auth: string;
      user: UserInfo;
    }
  | {
      type: "guest";
    };

const socketIdState = selector({
  key: "socketRoot-socketIdState",
  get: ({ get }) => {},
});

export const SocketRoot: React.VFC<SocketRootProps> = ({
  children,
  roomId,
  userParam,
}) => {
  useSetCommentsHandler();
  useSetTimerHandler();
  useSetTimetableHandler();
  useSetRoomStateHandler();

  const allRefresher = useStatesRefresher();

  useEffect(() => {
    if (userParam.type === "user") {
      socket.emit(
        "joinRoomAsUser",
        {
          roomId: roomId,
          auth: userParam.auth,
          userId: userParam.user.id,
        },
        (res) => {
          if (res.status === "success") {
            console.log("joined room");
          } else {
            console.warn(`join room rejected: ${res.reason}`);
          }
        }
      );
    } else {
      socket.emit(
        "joinRoomAsGuest",
        {
          roomId: roomId,
        },
        (res) => {
          if (res.status === "success") {
            console.log("joined room");
          } else {
            console.warn(`join room rejected: ${res.reason}`);
          }
        }
      );
    }

    return () => {
      socket.emit("leaveRoom");
      allRefresher();
    };
  }, [allRefresher, roomId, userParam]);

  return <>{children}</>;
};

const useStatesRefresher = () => {
  // const refreshComments = useRefreshComments();
  // const refreshTimer = useRefreshTimer();
  // const refreshTimetable = useRefreshTimetable();
  // const refreshMembers = useRefreshMembers();

  return () => {
    // refreshComments();
    // refreshTimer();
    // refreshTimetable();
    // refreshMembers();
  };
};
