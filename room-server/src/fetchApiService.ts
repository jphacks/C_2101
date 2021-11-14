import { UserId, UserInfo } from "@api-schema/types/user";

import { client } from "./index";

export const getAuthedUser = async (auth: string): Promise<UserInfo | null> => {
  try {
    return await client.api.users.me.$get();
  } catch (e) {
    return null;
  }
};

export const getRoomInfo = async (roomId: number, auth: string) => {
  try {
    return await client.api.rooms._room_id(roomId).$get({
      config: {
        headers: {
          Authorization: auth,
        },
      },
    });
  } catch (e) {
    return null;
  }
};

export const issueSkywayCredential = async (
  roomId: number,
  userId: UserId,
  auth: string
) => {
  try {
    const res = await client.api.rooms._room_id(roomId).authenticate.$post({
      body: {
        peerId: `${userId}-video-${Math.floor(Math.random() * 1000)}`,
      },
      config: {
        headers: {
          Authorization: auth,
        },
      },
    });
    return res.skyway;
  } catch (e) {
    return null;
  }
};
