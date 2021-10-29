import React from "react";
import { useRouter } from "next/router";
import Error from "next/error";
import { Authed } from "../../components/function/Authed";
import { PageSpaceDetail } from "../../components/page/PageSpaceDetail";

const Room: React.VFC = () => {
  const router = useRouter();

  const roomIdStr = router.query.room_id;
  const roomId = roomIdStr ? Number(roomIdStr) : undefined;

  if (!roomId) {
    return <Error statusCode={404} />;
  }

  return (
    <Authed>
      <PageSpaceDetail roomId={roomId} />
    </Authed>
  );
};

export default Room;
