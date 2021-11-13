import React, { useEffect } from "react";
import { useRouter } from "next/router";

type SocketRootProps = {
  children: React.ReactNode;
  roomId: number;
};

export const SocketRoot: React.VFC<SocketRootProps> = ({
  children,
  roomId,
}) => {
  //const socket = useSocket();
  //useCommentListSetHandler(socket);

  useEffect(() => {
    //joinRoom();
    return () => {
      // leaveRoom();
    };
  }, [roomId]);

  return <>{children}</>;
};
