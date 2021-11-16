import React from "react";
import { useLogin } from "../../../../hooks/useLogin";
import { useLegacySkywayCredential } from "../../../../hooks/useLegacySkywayCredential";
import { useLegacyRoom } from "../../../../hooks/useLegacyRoom";
import Layout from "../../../Layout";
import { Text } from "@chakra-ui/react";
import { SpacePageMain } from "./SpacePageMainComment";

export const Space: React.VFC<{
  roomId: number;
}> = ({ roomId }) => {
  const { user, authHeader } = useLogin();

  const { credential } = useLegacySkywayCredential({
    roomId: roomId,
    index: 0,
    userId: user?.id,
    authHeader,
  });

  const { credential: credentialSub } = useLegacySkywayCredential({
    roomId: roomId,
    index: 1,
    userId: user?.id,
    authHeader,
  });

  const { room, roomError, userMap, userList } = useLegacyRoom(roomId);

  // console.log({
  //   roomId: roomId,
  //   userId: user?.id,
  //   authHeader: authHeader,
  // });

  if (!user || !authHeader) {
    return (
      <Layout>
        <Text>Not Authorized</Text>
      </Layout>
    );
  }

  if (!credential || !credentialSub) {
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
    <SpacePageMain
      room={room}
      memberList={userList}
      memberMap={userMap}
      user={user}
      credential={credential}
      credentialSub={credentialSub}
    />
  );
};
