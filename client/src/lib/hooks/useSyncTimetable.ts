import {
  TimetableSection,
  TimetableState,
} from "@api-schema/types/timetableState";
import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { useCallback, useEffect } from "react";
import { socket } from "./socket";
import { TimetableCardProps } from "../../components/page/space/timetableBlock/TimetableCard";
import { memberMapState } from "./useSyncMembers";
import { userState } from "./useUser";
import { RoomMember } from "@api-schema/types/member";

/**
 * 直接コンポーネントから参照しない
 * hookを作ってそれを介して使う
 */
export const timetableState = atom<TimetableState>({
  key: "useStateTimetable-timetableState",
  default: new Promise((resolve) => {
    socket.once("joinedRoom", () => {
      socket.emit("getTimetableState", (res) => {
        console.log("set default timetable state", res);
        resolve(res);
      });
    });
  }),
});

export const useSetTimetableHandler = () => {
  const setState = useSetRecoilState(timetableState);

  useEffect(() => {
    const listener = (timetable: TimetableState) => {
      setState(timetable);
    };

    socket.on("updateTimetable", listener);
    return () => {
      socket.off("updateTimetable", listener);
    };
  }, [setState]);
};

export const useTimetableAction = () => {
  const [state, setState] = useRecoilState(timetableState);

  const moveNextSection = useCallback(() => {
    const nextState = {
      ...state,
      cursor: Math.max(
        0,
        Math.min(state.cursor + 1, state.sections.length - 1)
      ),
    };
    setState(nextState);
    socket.emit("setTimetable", nextState);
  }, [setState, state]);

  const movePrevSection = useCallback(() => {
    const nextState = {
      ...state,
      cursor: Math.max(
        0,
        Math.min(state.cursor - 1, state.sections.length - 1)
      ),
    };
    setState(nextState);
    socket.emit("setTimetable", nextState);
  }, [setState, state]);

  return {
    moveNextSection,
    movePrevSection,
  };
};

export const useTimetableValue = () => {
  return useRecoilValue(timetableState);
};

export const useRefreshTimetable = () => {
  return useRecoilCallback(({ set }) => () => {
    socket.emit("getTimetableState", (res) => {
      set(timetableState, res);
    });
  });
};

const timetableCardsPropsState = selector<TimetableCardProps[]>({
  key: "useSyncTimetable-timetableCardsPropsState",
  get: ({ get }) => {
    const memberMap = get(memberMapState);
    const timetable = get(timetableState);
    const user = get(userState);
    const current = timetable.sections[timetable.cursor];

    return timetable.sections
      .reduce((acc: TimetableCardProps[], item: TimetableSection, i) => {
        //TODO 推定開始時間を計算

        if (item.type !== "speaking") {
          return acc;
        }

        const last: TimetableCardProps | undefined = acc[acc.length - 1];
        if (!last || last.title !== item.sessionTitle) {
          acc.push({
            title: item.sessionTitle,
            user: memberMap[item.userId].user,
            tags: [],
            isCurrentSection:
              current?.type === "speaking" &&
              current.userId === item.userId &&
              current.sessionTitle === item.sessionTitle,
          });
        }
        return acc;
      }, [] as TimetableCardProps[])
      .map((card, index, array) => {
        const tags: string[] = [];
        if (card.user.id === user?.id) {
          tags.push("You");
        }
        const prev = array[index - 1];
        //ちょっと強引ではある
        if (
          (prev && prev.isCurrentSection) ||
          (timetable.cursor === 0 && index == 0)
        ) {
          tags.push("Next");
        }
        return {
          ...card,
          tags: tags,
        };
      });
  },
});

export const useTimetableCardsProps = (): TimetableCardProps[] => {
  return useRecoilValue(timetableCardsPropsState);
};

const timetableCurrentSectionState = selector<TimetableSection | null>({
  key: "timetableCurrentSectionState-useSyncTimetable",
  get: ({ get }) => {
    const timetable = get(timetableState);
    return timetable.sections[timetable.cursor];
  },
});

export const useTimetableCurrentSection = () => {
  return useRecoilValue(timetableCurrentSectionState);
};

const speakingMemberState = selector<RoomMember | null>({
  key: "useSyncTimetable-speakingMemberState",
  get: ({ get }) => {
    const currentSection = get(timetableCurrentSectionState);
    const memberMap = get(memberMapState);
    if (currentSection?.type === "speaking") {
      return memberMap[currentSection.userId] ?? null;
    } else {
      return null;
    }
  },
});

export const useSpeakingMember = () => {
  return useRecoilValue(speakingMemberState);
};

const isCurrentOwnSessionState = selector<boolean>({
  key: "timetableCurrentSectionState-isCurrentOwnSessionState",
  get: ({ get }) => {
    const currentSection = get(timetableCurrentSectionState);
    const user = get(userState);
    if (!currentSection || !user) return false;
    return (
      currentSection.type === "speaking" && currentSection.userId == user.id
    );
  },
});

export const useIsCurrentOwnSession = () => {
  return useRecoilValue(isCurrentOwnSessionState);
};
