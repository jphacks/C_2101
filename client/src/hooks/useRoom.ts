import client from "../utils/api-client.factory";

import useSWR from "swr";
import { useMemo } from "react";
import { UserType } from "../components/page/space/memberBlock/MemberItem";
import { UserResponse } from "@api-schema/api/@types";

const roomFetcher = async (key: string, roomId: number) => {
  return await client.api.rooms._room_id(roomId).$get();
};

export type Member = Omit<UserResponse, "email"> & {
  type: UserType;
  isOwner: boolean;
};
export const useRoom = (roomId: number | undefined) => {
  const {
    data: room,
    error: roomError,
    mutate,
  } = useSWR(roomId ? ["/api/rooms", roomId] : null, roomFetcher, {});

  const { userList, userMap } = useMemo<{
    userList: Member[] | undefined;
    userMap: Record<number, Member> | undefined;
  }>(() => {
    if (!room)
      return {
        userList: undefined,
        userMap: undefined,
      };
    const userList: Member[] = [
      ...room.speakers.map((item) => ({
        ...item,
        type: UserType.Speaker,
      })),
      ...room.viewers.map((item) => ({
        ...item,
        type: UserType.Viewer,
      })),
    ].map((item) => ({
      ...item,
      isOwner: room.owner.id === item.id,
    }));

    const userMap: Record<number, Member> = userList.reduce((acc, item) => {
      return {
        ...acc,
        [item.id]: item,
      };
    }, {});

    return {
      userList: userList,
      userMap: userMap,
    };
  }, [room]);

  return {
    room,
    roomError,
    mutate,
    userList: userList,
    userMap: userMap,
  };
};
