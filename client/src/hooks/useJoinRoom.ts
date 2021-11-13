import client from "../utils/api-client.factory";
import { RoomJoinRequest } from "@api-schema/api/@types";
import { useToast } from "@chakra-ui/react";

export const useJoinRoom = (roomId: number) => {
  const toast = useToast();

  return async (body: RoomJoinRequest) => {
    return await client.api.rooms
      ._room_id(roomId)
      .join.$post({
        body: body,
      })
      .then(() => {
        toast({
          title: "登録しました",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err:string) => {
        toast({
          title: err,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };
};
