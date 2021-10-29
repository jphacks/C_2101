import { useLocalStorage } from "react-use";
import client from "../utils/api-client.factory";
import useSWR from "swr";

type AuthHeader = {
  Authorization: string;
};

const userFetcher = async (key: string, authHeader: AuthHeader) => {
  const res = await client.api.users.me.get();
  return res.body;
};

export const useLogin = () => {
  const [authHeader, setAuthHeader, destroyAuthHeader] = useLocalStorage<
    AuthHeader | undefined
  >("lt-space-auth-token");

  const fetchLogin = async (loginParam: {
    email: string;
    password: string;
  }) => {
    const res = await client.api.login.$post({
      body: loginParam,
    });

    const header = {
      Authorization: `${res.tokenType} ${res.accessToken}`,
    };
    setAuthHeader(header);
    return header;
  };

  const {
    data: user,
    error: userError,
    mutate: mutateUser,
  } = useSWR(authHeader ? ["/api/users/me"] : null, userFetcher, {});
  //onError未使用になってるけど呼ばれるんだよなあ

  const logout = async () => {
    destroyAuthHeader();
    await mutateUser(undefined);
  };

  const isAuthed = !!authHeader;

  return {
    fetchLogin,
    logout,
    user,
    userError,
    authHeader,
    isAuthed,
  };
};
