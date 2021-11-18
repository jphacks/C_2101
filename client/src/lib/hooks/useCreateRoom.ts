import { useAuthHeader } from "./useAuth";
import { useCallback } from "react";
import client from "../../utils/api-client.factory";
import { RoomCreateRequest } from "@api-schema/api/@types";
import moment from "moment-timezone";

export const useCreateRoom = () => {
  const auth = useAuthHeader();

  return useCallback(
    async (param: {
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
      presentationTimeMinute: number;
      questionTimeMinute: number;
      imageBase64?: string;
    }) => {
      if (!auth) {
        throw Error("ログインしていません");
      }

      const apiParam: RoomCreateRequest = {
        title: param.title,
        description: param.description,
        startAt: moment(param.startDate).tz("Asia/Tokyo").format(),
        finishAt: moment(param.endDate).tz("Asia/Tokyo").format(),
        presentationTimeLimit: param.presentationTimeMinute * 60,
        questionTimeLimit: param.questionTimeMinute * 60,
        image: param.imageBase64,
      };

      return client.api.rooms.$post({
        body: apiParam,
        config: {
          headers: auth,
        },
      });
    },
    [auth]
  );
};
