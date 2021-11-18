import React, { Suspense, useEffect } from "react";
import { Spinner } from "@chakra-ui/react";
import { LTContainer } from "./LTContainer";
import { useSetRoomId } from "../../../lib/hooks/useRoom";
import { useAuthHeader } from "../../../lib/hooks/useAuth";
import { SocketRoot } from "../../function/SocketRoot";
import { useUser } from "../../../lib/hooks/useUser";

export const Space: React.VFC<{
  roomId: number;
}> = ({ roomId }) => {
  const setRoomId = useSetRoomId();

  useEffect(() => {
    //ここでセットせずに、routerのイベントでやった方がいいかも
    setRoomId(roomId);
  }, [roomId, setRoomId]);

  const auth = useAuthHeader();
  const user = useUser();

  if (!auth || !user) {
    return <p>pls login</p>;
  }

  return (
    <Suspense fallback={<Spinner />}>
      <SocketRoot
        roomId={roomId}
        userParam={{
          type: "user",
          user: user,
          auth: auth.Authorization,
        }}
      >
        <LTContainer />
      </SocketRoot>
    </Suspense>
  );
};
