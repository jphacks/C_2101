import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { Text } from "@chakra-ui/react";
import { useLogin } from "../../hooks/useLogin";
import { useSkywayCredential } from "../../hooks/useSkywayCredential";
import { LTPage } from "../../components/space/LTPage";

const Room: React.VFC = () => {
  const router = useRouter();

  const spaceId = router.query.room_id
    ? Number(router.query.room_id)
    : undefined;

  //ログインしていなかったら/loginに飛ばす
  const { isAuthed, user, authHeader } = useLogin();
  useEffect(() => {
    if (!isAuthed) {
      console.log("not authed");
      void router.push(`/login?next=${router.asPath}`);
    }
  });

  const { credential, error } = useSkywayCredential({
    roomId: spaceId,
    userId: user?.id,
    authHeader: authHeader,
  });

  console.log({
    roomId: spaceId,
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

  return <LTPage user={user} authHeader={authHeader} credential={credential} />;
};

export default Room;
