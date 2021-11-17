import { RoomResponse } from "api-schema/src/api/@types";
import { TimetableSection } from "api-schema/src/types/timetableState";

import { RoomSessionModel } from "../model/RoomSessionModel";

export class RoomSessionFactory {
  /**
   * ルーム情報から初期化されたルームセッションを作成
   *
   * @param {RoomResponse} room
   *
   * @return {RoomSessionModel} 初期化したルームセッション
   */
  create(room: RoomResponse): RoomSessionModel {
    const sections = room.speakers.reduce((acc, item, i, self) => {
      const additionalSection: TimetableSection[] = [];

      additionalSection.push({
        type: "speaking",
        userId: item.id,
        sessionTitle: item.title,
        sectionTitle: "発表",
        estimateTimeSec: room.presentationTimeLimit,
      });

      if (room.questionTimeLimit > 0) {
        additionalSection.push({
          type: "speaking",
          userId: item.id,
          sessionTitle: item.title,
          sectionTitle: "質問",
          estimateTimeSec: room.questionTimeLimit,
        });
      }

      if (i !== self.length - 1) {
        additionalSection.push({
          type: "between",
        });
      }

      return [...acc, ...additionalSection];
    }, [] as TimetableSection[]);

    return {
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
  }
}
