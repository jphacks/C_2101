import client from "../utils/api-client.factory";

import useSWR from "swr";

const roomFetcher = async (key: string, roomId: number) => {
  return await client.api.rooms._room_id(roomId).$get();
};

export const useRoom = (roomId: number | undefined) => {
  const { data: room, error: roomError } = useSWR(
    roomId ? ["/api/rooms", roomId] : null,
    roomFetcher,
    {}
  );

  return {
    room,
    roomError,
  };
};
