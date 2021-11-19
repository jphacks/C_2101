import React, { useEffect} from "react";
import { useSetCommentsHandler } from "../../lib/hooks/useSyncComment";
import { useSetTimerHandler } from "../../lib/hooks/useSyncTimer";
import { useSetTimetableHandler } from "../../lib/hooks/useSyncTimetable";
import { useSetRoomStateHandler } from "../../lib/hooks/useSyncMembers";
import { socket } from "../../lib/hooks/socket";
import { UserInfo } from "@api-schema/types/user";
import { useSetReactionHandler } from "../../lib/hooks/useSyncReaction";

import {
  useSetCameraCredential,
  useSetListenCredential,
  useSetScreenCredential,
} from "../../lib/hooks/useCredential";
import { useSetStreamHandler } from "../../lib/hooks/useSyncStream";

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

export const SocketRoot: React.VFC<SocketRootProps> = ({
  children,
  roomId,
  userParam,
}) => {
  useSetCommentsHandler();
  useSetTimerHandler();
  useSetTimetableHandler();
  useSetRoomStateHandler();
  useSetReactionHandler();
  useSetStreamHandler();

  const allRefresher = useStatesRefresher();

  const setListenCredential = useSetListenCredential();
  const setCameraCredential = useSetCameraCredential();
  const setScreenCredential = useSetScreenCredential();

  // const [roomJoined, setRoomJoined] = useState<boolean>(false);

  useEffect(() => {
    // if (roomJoined) return;
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
            setListenCredential(res.credential);
            // setRoomJoined(true);

            socket.emit(
              "getScreenCredential",
              userParam.auth,
              (screenCredential) => {
                setScreenCredential(screenCredential);
              }
            );
            socket.emit(
              "getCameraCredential",
              userParam.auth,
              (cameraCredential) => {
                setCameraCredential(cameraCredential);
              }
            );
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
      // setRoomJoined(false);
      allRefresher();
    };
  }, [
    allRefresher,
    roomId,
    setCameraCredential,
    setListenCredential,
    setScreenCredential,
    userParam,
  ]);

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
