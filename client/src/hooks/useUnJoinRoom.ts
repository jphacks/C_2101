import client from "../utils/api-client.factory";
import { useToast } from "@chakra-ui/react";

export const useUnJoinRoom = (roomId: number) => {
  const toast = useToast();

  return async () => {
    return await client.api.rooms
      ._room_id(roomId)
      .unjoin.$post({})
      .catch((err) => {
        toast({
          title: err.message,
          status: err,
          duration: 5000,
          isClosable: true,
        });
      });
  };
};
