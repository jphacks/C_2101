import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";

const Room: React.VFC = () => {
  const router = useRouter();

  const spaceId = router.query.room_id?.toString();

  return <Layout contentTitle={spaceId}>room: {spaceId}</Layout>;
};

export default Room;
