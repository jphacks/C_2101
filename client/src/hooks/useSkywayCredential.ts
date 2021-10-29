import { AuthHeader } from "./useLogin";
import client from "../utils/api-client.factory";
import useSWR from "swr";
import { RoomCredentialsResponse } from "../api/@types";

const credentialFetcher = async (
  key: string,
  userId: number,
  roomId: number,
  authHeaderParam: string
) => {
  // console.log("fetch");
  return await client.api.rooms._room_id(roomId).authenticate.$post({
    body: {
      peerId: userId.toString(),
    },
    config: {
      headers: {
        Authorization: authHeaderParam,
      },
    },
  });
};

type FetchCredentialParam = {
  userId: number;
  roomId: number;
  authHeader: AuthHeader;
};

export const useSkywayCredential = (param: Partial<FetchCredentialParam>) => {
  const { userId, roomId, authHeader } = param;
  //
  // console.log(
  //   `enable: ${userId != undefined && roomId != undefined && authHeader}`
  // );

  // const peerId = ``

  const { data, error, mutate } = useSWR<RoomCredentialsResponse>(
    userId != undefined && roomId != undefined && authHeader
      ? [
          `/api/rooms/{roomId}/authenticate`,
          userId,
          roomId,
          authHeader.Authorization,
        ]
      : null,
    credentialFetcher
  );

  const regenerate = async () => {
    return await mutate();
  };

  return {
    credential: data?.skyway,
    error: error,
    regenerate: regenerate,
  };
};
