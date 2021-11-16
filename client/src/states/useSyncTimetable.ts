import {
  TimetableSection,
  TimetableState,
} from "@api-schema/types/timetableState";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback, useEffect } from "react";
import { socket } from "../hooks/socket";
import { InitialStateParams } from "@api-schema/types/events";
import { TimetableCardProps } from "../components/page/space/timetableBlock/TimetableCard";
import {
  memberMapState,
  useMemberMap,
  useMembersValue,
} from "./useSyncMembers";

/**
 * 直接コンポーネントから参照しない
 * hookを作ってそれを介して使う
 */
export const timetableState = atom<TimetableState>({
  key: "useStateTimetable-timetableState",
  default: {
    cursor: 0,
    sections: [],
  },
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
  });
};

export const useTimetableAction = () => {
  const setState = useSetRecoilState(timetableState);

  const moveNextSection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      cursor: Math.max(0, Math.min(prev.cursor + 1, prev.sections.length - 1)),
    }));
  }, [setState]);

  const movePrevSection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      cursor: Math.max(0, Math.min(prev.cursor - 1, prev.sections.length - 1)),
    }));
  }, [setState]);

  return {
    moveNextSection,
    movePrevSection,
  };
};

export const useTimetableValue = () => {
  return useRecoilValue(timetableState);
};

export const useSetInitialTimetableState = () => {
  const setState = useSetRecoilState(timetableState);
  return useCallback(
    (initialStateParams: InitialStateParams) => {
      setState(initialStateParams.timetable);
    },
    [setState]
  );
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

        //TODO tag

        const last = acc[acc.length - 1];
        if (last.title !== item.sessionTitle) {
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

const timetableCurrentSectionState = selector({
  key: "timetableCurrentSectionState-useSyncTimetable",
  get: ({ get }) => {
    const timetable = get(timetableState);
    return timetable.sections[timetable.cursor];
  },
});

export const useTimetableCurrentSection = () => {
  return useRecoilValue(timetableCurrentSectionState);
};
