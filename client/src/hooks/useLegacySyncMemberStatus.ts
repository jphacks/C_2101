import { MutableRefObject, useCallback, useEffect } from "react";
import Peer, { RoomData, SfuRoom } from "skyway-js";
import { Member } from "./useRoom";
import { useMap } from "react-use";
import { SkywayData } from "../types/skywayData";

type UseSyncMemberStatusParam = {
  peerRef: MutableRefObject<Peer | undefined>;
  roomRef: MutableRefObject<SfuRoom | undefined>;
  memberList: Member[];
  memberFetcher: (peerId: string) => Member | undefined;
};

export type MemberStatus = {
  member: Member;
  peerIdList: string[];
  isOnline: boolean;
  reaction: ReactionState;
};

type ReactionState = {
  emoji: string;
  timerId: NodeJS.Timeout | undefined;
};

// type ConnectionState = {
//   peerId: string,
//   label: "main" | "sub",
//
// }

export const useLegacySyncMemberStatus = ({
  peerRef,
  roomRef,
  memberList,
  memberFetcher,
}: UseSyncMemberStatusParam) => {
  const [memberStatusMap, { set, setAll }] = useMap<
    Record<number, MemberStatus>
  >({});

  const updateStatus = useCallback(() => {
    const room = roomRef.current;
    if (!room) return;

    const onlinePeerIds = [...room.members, peerRef.current!.id];
    console.log("statusUpdate", onlinePeerIds);
    const memberPeer = onlinePeerIds.map((peerId) => ({
      peerId: peerId,
      memberId: memberFetcher(peerId)?.id,
    }));

    const onlineMemberIds = Array.from(
      new Set(memberPeer.map((item) => item.memberId))
    );

    const nextMap = memberList
      .map((user) => {
        const isOnline = onlineMemberIds.includes(user.id);
        const peerIds = memberPeer
          .filter((item) => item.memberId === user.id)
          .map((item) => item.peerId);
        //reactionは前のを引き継ぐ
        const reaction: ReactionState = memberStatusMap[user.id]?.reaction ?? {
          emoji: "",
        };

        return {
          member: user,
          peerIdList: peerIds,
          isOnline: isOnline,
          reaction: reaction,
        };
      })
      .reduce(
        (acc, item) => ({
          ...acc,
          [item.member.id]: item,
        }),
        {}
      );

    setAll(nextMap);
  }, [memberFetcher, memberList, memberStatusMap, peerRef, roomRef, setAll]);
  //
  // useEffect(() => {
  //   updateStatus();
  // }, [updateStatus]);

  useEffect(() => {
    console.log("hook");
    const listener = () => {
      updateStatus();
    };

    const room = roomRef.current;

    room?.on("peerJoin", listener);
    room?.on("peerLeave", listener);
    // room?.on("open", listener);

    return () => {
      room?.off("peerJoin", listener);
      room?.off("peerLeave", listener);
      // room?.off("open", listener);
    };
  });

  useEffect(() => {
    const room = roomRef.current;
    if (!room) return;

    const listener = (roomData: RoomData) => {
      const data = roomData.data as SkywayData;
      const user = memberFetcher(roomData.src);
      if (user && data.type === "reactionEmoji") {
        const timer = setTimeout(() => {
          set(user.id, {
            ...memberStatusMap[user.id],
            reaction: {
              emoji: "",
              timerId: undefined,
            },
          });
        }, 5000);

        const prevReaction = memberStatusMap[user.id].reaction;

        if (prevReaction.timerId) {
          clearTimeout(prevReaction.timerId);
        }
        set(user.id, {
          ...memberStatusMap[user.id],
          reaction: {
            emoji: data.emoji,
            timerId: timer,
          },
        });
      }
    };

    room.on("data", listener);

    return () => {
      room.off("data", listener);
    };
  });

  return {
    memberStatusMap,
    updateStatus,
  };
};
