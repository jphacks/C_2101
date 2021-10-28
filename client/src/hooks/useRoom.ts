import client from "../utils/api-client.factory";
import { AuthHeader } from "./useLogin";
import useSWR from "swr";

const roomFetcher = async (
  key: string,
  roomId: number,
  authHeader: AuthHeader
) => {
  return await client.api.rooms._room_id(roomId).$get({
    config: {
      headers: authHeader,
    },
  });
};

type UseRoomParam = {
  authHeader: AuthHeader;
  roomId: number;
};

export const useRoom = ({ authHeader, roomId }: Partial<UseRoomParam>) => {
  const { data, error } = useSWR(
    authHeader && roomId ? ["/api/room/{roomId}", roomId, authHeader] : null,
    roomFetcher
  );

  return {
    data,
    error,
  };
};
