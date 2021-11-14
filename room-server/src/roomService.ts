import { RoomResponse, SkywayCredentialsModel } from "@api-schema/api/@types";
import { MemberType, RoomMember } from "@api-schema/types/member";
import { TimetableSection } from "@api-schema/types/timetableState";
import { UserId, UserInfo } from "@api-schema/types/user";
import produce from "immer";

import { roomSessionRepository, RoomSessionValue } from "./roomRepository";

export const joinUser = async (
  user: UserInfo,
  socketId: string,
  roomInfo: RoomResponse,
  credential: SkywayCredentialsModel
) => {
  const roomSession =
    (await roomSessionRepository.get(roomInfo.id)) ??
    getInitialRoomSession(roomInfo);

  const member: RoomMember = {
    type: getMemberType(user.id, roomInfo),
    user: user,
    authority: roomInfo.owner.id === user.id ? "Owner" : "General",
    connection: {
      isOnline: true,
      socketId: socketId,
      streamIds: {
        videotelephony: null,
        screenShare: null,
      },
      skywayPeerIds: {
        videotelephony: credential.peerId,
        screenShare: null,
      },
    },
  };

  await roomSessionRepository.set(
    roomInfo.id,
    produce(roomSession, (draft) => {
      draft.members
        .filter(
          (item) =>
            !(item.connection.isOnline && item.connection.socketId === socketId)
        )
        .push(member);
    })
  );
};

const getInitialRoomSession = (roomInfo: RoomResponse) => {
  const sections = roomInfo.speakers.reduce((acc, item, i, self) => {
    const additionalSection: TimetableSection[] = [];

    additionalSection.push({
      type: "speaking",
      userId: item.id,
      sessionTitle: item.title,
      sectionTitle: "発表",
      estimateTimeSec: roomInfo.presentationTimeLimit,
    });

    if (roomInfo.questionTimeLimit > 0) {
      additionalSection.push({
        type: "speaking",
        userId: item.id,
        sessionTitle: item.title,
        sectionTitle: "質問",
        estimateTimeSec: roomInfo.questionTimeLimit,
      });
    }

    if (i !== self.length - 1) {
      additionalSection.push({
        type: "between",
      });
    }

    return [...acc, ...additionalSection];
  }, [] as TimetableSection[]);

  const initialRoom: RoomSessionValue = {
    comments: [],
    timer: {
      timerEnabled: false,
      accTime: 0,
    },
    timetable: {
      cursor: 0,
      sections: sections,
    },
    members: [],
    streamState: {
      focusScreenStreamId: null,
      focusVideoStreamId: null,
    },
  };
  return initialRoom;
};

const getMemberType = (userId: UserId, roomInfo: RoomResponse): MemberType => {
  if (roomInfo.speakers.some((speaker) => speaker.id === userId)) {
    return "Speaker";
  } else {
    return "Viewer";
  }
};
