import React, { useEffect } from "react";
import { useSetCommentsHandler } from "../../lib/hooks/useSyncComment";
import { useSetTimerHandler } from "../../lib/hooks/useSyncTimer";
import { useSetTimetableHandler } from "../../lib/hooks/useSyncTimetable";
import { useSetRoomStateHandler } from "../../lib/hooks/useSyncMembers";
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
          }
        }
      );
    }

    return () => {
      socket.emit("leaveRoom");
    };
  }, [roomId, userParam]);

  return <>{children}</>;
};
