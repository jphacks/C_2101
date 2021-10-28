import { useLocalStorage } from "react-use";
import client from "../utils/api-client.factory";
import useSWR from "swr";

const userFetcher = async (
  key: string,
  authHeader: {
    Authorization: string;
  }
) => {
  const res = await client.api.users.me.get();
  return res.body;
};

export const useLogin = () => {
  const [authHeader, setAuthHeader, destroyAuthHeader] = useLocalStorage<
    | {
        Authorization: string;
      }
    | undefined
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

  return {
    fetchLogin,
    logout,
    user,
    userError,
    authHeader,
  };
};
