import React from "react";
import { useLogin } from "../../../hooks/useLogin";
import { useSkywayCredential } from "../../../hooks/useSkywayCredential";
import { useRoom } from "../../../hooks/useRoom";
import { Authed } from "../../function/Authed";
import Layout from "../../Layout";
import { Text } from "@chakra-ui/react";
import { SpacePageMain } from "./SpacePageMain";

export const Space: React.VFC<{
  roomId: number;
}> = ({ roomId }) => {
  const { user, authHeader } = useLogin();

  const { credential } = useSkywayCredential({
    roomId: roomId,
    userId: user?.id,
  });

  const { room, roomError, userMap, userList } = useRoom(roomId);

  console.log({
    roomId: roomId,
    userId: user?.id,
    authHeader: authHeader,
  });

  if (!user || !authHeader) {
    return (
      <Authed>
        <Layout>
          <Text>Not Authorized</Text>
        </Layout>
      </Authed>
    );
  }

  if (!credential) {
    return (
      <Authed>
        <Layout>
          <Text>Not Credential Authorized</Text>
        </Layout>
      </Authed>
    );
  }

  if (!room || roomError || !userList || !userMap) {
    return (
      <Authed>
        <Layout>
          <Text>Room Not Found</Text>
        </Layout>
      </Authed>
    );
  }

  return (
    <Authed>
      <SpacePageMain
        room={room}
        memberList={userList}
        memberMap={userMap}
        user={user}
        credential={credential}
      />
    </Authed>
  );
};
