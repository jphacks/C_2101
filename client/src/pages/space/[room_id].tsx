import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { Text } from "@chakra-ui/react";
import { useLogin } from "../../hooks/useLogin";
import { useSkywayCredential } from "../../hooks/useSkywayCredential";
import { LTPage } from "../../components/space/LTPage";
import { useRoom } from "../../hooks/useRoom";

const Room: React.VFC = () => {
  const router = useRouter();

  const roomIdStr = router.query.room_id;
  const roomId = roomIdStr ? Number(roomIdStr) : undefined;

  //ログインしていなかったら/loginに飛ばす
  const { isAuthed, user, authHeader } = useLogin();
  useEffect(() => {
    if (!isAuthed) {
      console.log("not authed");
      void router.push(`/login?next=${router.asPath}`);
    }
  });

  const { credential, error } = useSkywayCredential({
    roomId: roomId,
    userId: user?.id,
    authHeader: authHeader,
  });

  const { room, roomError, userMap, userList } = useRoom(roomId);

  console.log({
    roomId: roomId,
    userId: user?.id,
    authHeader: authHeader,
  });

  if (!user || !authHeader) {
    return (
      <Layout>
        <Text>Not Authorized</Text>
      </Layout>
    );
  }

  if (!credential) {
    return (
      <Layout>
        <Text>Not Credential Authorized</Text>
      </Layout>
    );
  }

  if (!room || roomError || !userList || !userMap) {
    return (
      <Layout>
        <Text>Room Not Found</Text>
      </Layout>
    );
  }

  return (
    <LTPage
      room={room}
      memberList={userList}
      memberMap={userMap}
      user={user}
      authHeader={authHeader}
      credential={credential}
    />
  );
};

export default Room;
