import React from "react";
import { useRouter } from "next/router";
import { Authed } from "../../components/function/Authed";
import { Space } from "../../components/page/space/PageSpace";
import Error from "next/error";

const Room: React.VFC = () => {
  const router = useRouter();

  const roomIdStr = router.query.room_id;
  const roomId = roomIdStr ? Number(roomIdStr) : undefined;

  if (!roomId) {
    return <Error statusCode={404} />;
  }

  return (
    <Authed>
      <Space roomId={roomId} />
    </Authed>
  );
};

export default Room;
