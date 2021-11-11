import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { RoomData, SfuRoom } from "skyway-js";
import { Timetable, TimetableSession } from "../types/timetable";
import { RoomResponse } from "@api-schema/api/@types";
import { SkywayData } from "../types/skywayData";
import { Member } from "./useRoom";

type UseSyncTimetableParam = {
  isOwner: boolean;
  roomRef: MutableRefObject<SfuRoom | undefined>;
  memberFetcher: (peerId: string) => Member | undefined;
  roomInfo: RoomResponse;
};

//prevとかもあったほうが良い
type Action = {
  type: "nextSection";
};
const createTimestamp = () => Date.now();
const timetableStateReducer = (state: Timetable, action: Action): Timetable => {
  const pointer = state.pointer;

  switch (action.type) {
    case "nextSection":
      //
      if (pointer.progress === "inSession") {
        const section = state.sessions[pointer.currentSession];

        //同じsessionで次のsectionがある
        if (section.section[pointer.currentSection + 1]) {
          return {
            sessions: state.sessions,
            pointer: {
              ...pointer,
              currentSection: pointer.currentSession + 1,
            },
          };
        } else {
          const nextSession = state.sessions[pointer.currentSession + 1];
          //前のsessionは終わり、次のsessionがある
          if (nextSession) {
            return {
              sessions: state.sessions,
              pointer: {
                ...pointer,
                currentSession: pointer.currentSession + 1,
                currentSection: 0,
              },
            };
          } else {
            return {
              sessions: state.sessions,
              pointer: {
                progress: "finished",
              },
            };
          }
        }
      } else if (pointer.progress === "waitingStart") {
        return {
          sessions: state.sessions,
          pointer: {
            progress: "inSession",
            currentSession: 0,
            currentSection: 0,
          },
        };
      } else {
        return state;
      }
  }
};

export const useSyncTimetable = ({
  roomInfo,
  roomRef,
  memberFetcher,
  isOwner,
}: UseSyncTimetableParam) => {
  const [state, setState] = useState<Timetable>({
    sessions: [],
    pointer: {
      progress: "waitingStart",
    },
  });

  const sendTimetable = useCallback(
    (value?: Timetable) => {
      const data: SkywayData = {
        type: "updateTimetable",
        timestamp: createTimestamp(),
        timetable: value ?? state,
      };
      roomRef.current?.send(data);
      if (roomRef.current) {
        console.log("sendTimetable", data);
      }
    },
    [roomRef, state]
  );

  const setNextSection = () => {
    setState((prevState) => {
      const nextState = timetableStateReducer(prevState, {
        type: "nextSection",
      });
      if (isOwner) {
        sendTimetable(nextState);
      }
      return nextState;
    });
  };

  useEffect(() => {
    // console.log("effect timetable");
    const room = roomRef.current;
    if (!room) return;
    // console.log("init timetable");

    const listener = (param: RoomData) => {
      const member = memberFetcher(param.src);
      const data = param.data as SkywayData;
      console.log("receive timetable", data);
      if (data.type === "updateTimetable" && member && member.isOwner) {
        setState(data.timetable);
      }
    };
    room.on("data", listener);

    return () => {
      room.off("data", listener);
    };
  });

  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (!isOwner) return;
    const room = roomRef.current;
    if (!room) return;

    const listener = () => {
      sendTimetable();
    };

    room.on("peerJoin", listener);
    return () => {
      room.off("peerJoin", listener);
    };
  });

  useEffect(() => {
    if (initialized) return;
    if (!isOwner) return;
    if (!roomInfo.speakers) return;
    const speakersSorted = roomInfo.speakers.sort(
      (a, b) => a.speakerOrder - b.speakerOrder
    );
    const entries: TimetableSession[] = speakersSorted.map((speaker) => {
      return {
        user: speaker,
        title: speaker.title,
        section: [
          {
            sectionTitle: "発表",
            lengthSec: roomInfo.presentationTimeLimit,
          },
          {
            sectionTitle: "質疑応答",
            lengthSec: roomInfo.questionTimeLimit,
          },
        ],
      };
    });

    const initialValue: Timetable = {
      sessions: entries,
      pointer: {
        progress: "waitingStart",
      },
    };
    setState(initialValue);
    sendTimetable(initialValue);
    setInitialized(true);
  }, [
    initialized,
    isOwner,
    roomInfo.presentationTimeLimit,
    roomInfo.questionTimeLimit,
    roomInfo.speakers,
    sendTimetable,
  ]);

  const getCurrentPresentingUser = () => {
    if (state.pointer.progress !== "inSession") return;
    return state.sessions[state.pointer.currentSession].user;
  };

  return {
    state,
    timetableAction: {
      setNextSection,
    },
    getCurrentPresentingUser,
  };
};
