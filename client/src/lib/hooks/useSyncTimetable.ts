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

    return timetable.sections.reduce(
      (acc: TimetableCardProps[], item: TimetableSection) => {
        //TODO 推定開始時間を計算

        if (item.type !== "speaking") {
          return acc;
        }
        // console.log(item);

        //TODO tag
        const last: TimetableCardProps | undefined = acc[acc.length - 1];
        if (!last || last.title !== item.sessionTitle) {
          acc.push({
            title: item.sessionTitle,
            user: memberMap[item.userId].user,
            tags: [],
          });
        }
        return acc;
      },
      [] as TimetableCardProps[]
    );
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
