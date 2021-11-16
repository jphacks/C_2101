import React, { Suspense, useEffect } from "react";
import { Spinner } from "@chakra-ui/react";
import { LTContainer } from "./LTContainer";
import { useSetRoomId } from "../../../lib/hooks/useRoom";

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
