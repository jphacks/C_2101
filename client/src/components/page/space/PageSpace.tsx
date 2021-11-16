import React, { Suspense, useEffect, useMemo } from "react";
import { useLogin } from "../../../hooks/useLogin";
import { useLegacySkywayCredential } from "../../../hooks/useLegacySkywayCredential";
import { useLegacyRoom } from "../../../hooks/useLegacyRoom";
import Layout from "../../Layout";
import { Spinner, Text } from "@chakra-ui/react";
import { LTContainer } from "./LTContainer";
import { SocketRoot, UserParam } from "../../function/SocketRoot";
import { useSetRoomId } from "../../../states/useRoom";

export const Space: React.VFC<{
  roomId: number;
}> = ({ roomId }) => {
  const setRoomId = useSetRoomId();

  useEffect(() => {
    //ここでセットせずに、routerのイベントでやった方がいいかも
    setRoomId(roomId);
  }, [roomId, setRoomId]);

  return (
    <Suspense fallback={<Spinner />}>
      <LTContainer />
    </Suspense>
  );
};
