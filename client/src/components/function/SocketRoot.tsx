import React, { useCallback, useEffect } from "react";
import {
  useSetCommentsHandler,
  useSetInitialCommentsState,
} from "../../states/useSyncComment";
import {
  useSetInitialTimerState,
  useSetTimerHandler,
} from "../../states/useSyncTimer";
import {
  useSetInitialTimetableState,
  useSetTimetableHandler,
} from "../../states/useSyncTimetable";
import {
  useSetInitialRoomState,
  useSetRoomStateHandler,
} from "../../states/useSyncRoomState";
import { socket } from "../../hooks/socket";
import { UserInfo } from "@api-schema/types/user";
import { InitialStateParams } from "@api-schema/types/events";

type SocketRootProps = {
  children: React.ReactNode;
  roomId: number;
  userParam: UserParam;
};

type UserParam =
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

  const setInitialStates = useInitialStates();

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
            //TODO credentialをどこかに記録する
            socket.emit("getInitialStates", (res) => {
              setInitialStates(res);
            });
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
            //TODO credentialをどこかに記録する
            socket.emit("getInitialStates", (res) => {
              setInitialStates(res);
            });
          }
        }
      );
    }

    return () => {
      socket.emit("leaveRoom");
    };
  }, [roomId, setInitialStates, userParam]);

  return <>{children}</>;
};

const useInitialStates = () => {
  const setInitialComments = useSetInitialCommentsState();
  const setInitialRoomState = useSetInitialRoomState();
  const setInitialTimetable = useSetInitialTimetableState();
  const setInitialTimer = useSetInitialTimerState();

  return useCallback(
    (initialStates: InitialStateParams) => {
      setInitialComments(initialStates);
      setInitialRoomState(initialStates);
      setInitialTimetable(initialStates);
      setInitialTimer(initialStates);
    },
    [
      setInitialComments,
      setInitialRoomState,
      setInitialTimer,
      setInitialTimetable,
    ]
  );
};
