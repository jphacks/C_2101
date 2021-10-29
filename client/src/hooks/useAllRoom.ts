import client from "../utils/api-client.factory";

import useSWR from "swr";

const roomsFetcher = async (key: string) => {
  return (await client.api.rooms.$get({})).rooms;
};

export const useAllRoom = () => {
  const { data: rooms, error: roomsError } = useSWR(
    ["/api/rooms"],
    roomsFetcher,
    {}
  );

  return {
    rooms,
    roomsError,
  };
};
