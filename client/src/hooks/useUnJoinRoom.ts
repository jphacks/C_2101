import client from "../utils/api-client.factory";
import { useToast } from "@chakra-ui/react";

export const useUnJoinRoom = (roomId: number) => {
  const toast = useToast();

  return async () => {
    return await client.api.rooms
      ._room_id(roomId)
      .unjoin.$post({})
      .then(() => {
        toast({
          title: "登録削除しました",
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
