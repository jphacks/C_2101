import client from "../utils/api-client.factory";
import useSWR from "swr";

const roomsFetcher = async (key: string) => {
  const res = await client.api.rooms.get({});
  return res.body.rooms;
};

export const useRoom = () => {
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
