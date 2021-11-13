import { TimetableState } from "@api-schema/types/timetableState";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback, useEffect } from "react";
import { socket } from "../hooks/socket";
import { InitialStateParams } from "@api-schema/types/events";

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

export const useTimetableCardProps = () => {};

export const useSetInitialTimetableState = () => {
  const setState = useSetRecoilState(timetableState);
  return useCallback(
    (initialStateParams: InitialStateParams) => {
      setState(initialStateParams.timetable);
    },
    [setState]
  );
};
