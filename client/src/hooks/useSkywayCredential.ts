import { AuthHeader } from "./useLogin";
import client from "../utils/api-client.factory";
import useSWR from "swr";
import { RoomCredentialsResponse } from "@api-schema/api/@types";
import { useRef } from "react";

const credentialFetcher = async (
  key: string,
  peerId: string,
  roomId: number,
  authHeaderParam: string
) => {
  console.log("fetch", peerId);
  return await client.api.rooms._room_id(roomId).authenticate.$post({
    body: {
      peerId: peerId,
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
  index: number;
  roomId: number;
  authHeader: AuthHeader;
};

export const useSkywayCredential = (param: Partial<FetchCredentialParam>) => {
  const { userId, index, roomId, authHeader } = param;

  const ref = useRef<number>(Math.floor(Math.random() * 1000));

  const { data, error, mutate } = useSWR<RoomCredentialsResponse>(
    userId != undefined &&
      index != undefined &&
      roomId != undefined &&
      authHeader
      ? [
          `/api/rooms/{roomId}/authenticate`,
          `${userId}-${index}-${ref.current}`,
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
