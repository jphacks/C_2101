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

type SocketRootProps = {
  children: React.ReactNode;
  roomId: number;
  userParam: UserParam;
};

export type UserParam =
  | {
      type: "user";
      authHeader: string;
      user: UserInfo;
    }
  | {
      type: "guest";
    };

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
          auth: userParam.authHeader,
          userId: userParam.user.id,
        },
        (res) => {
          if (res.status === "success") {
            console.log("joined room");
            allRefresher();
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
            allRefresher();
          }
        }
      );
    }

    return () => {
      socket.emit("leaveRoom");
    };
  }, [allRefresher, roomId, userParam]);

  return <>{children}</>;
};

const useStatesRefresher = () => {
  const refreshComments = useRefreshComments();
  const refreshTimer = useRefreshTimer();
  const refreshTimetable = useRefreshTimetable();
  const refreshMembers = useRefreshMembers();

  return () => {
    refreshComments();
    refreshTimer();
    refreshTimetable();
    refreshMembers();
  }
};
