import { TimerBlock } from "./TimerBlock";
import React, { useState } from "react";
import { useInterval } from "react-use";
import { Timetable } from "../../types/timetable";

type TimerBlockContainerProps = {
  isOwner: boolean;
  timetable: Timetable;
  calcRemainTimerSec: (fullSec: number, now?: number) => number;
  timetableAction: { setNextSection: () => void };
  timerAction: {
    reset: (enable: boolean) => void;
    pause: () => void;
    resume: () => void;
  };
};

export const TimerBlockContainer: React.VFC<TimerBlockContainerProps> = ({
  isOwner,
  timetable,
  calcRemainTimerSec,
  timerAction,
  timetableAction,
}: TimerBlockContainerProps) => {
  const currentSession =
    timetable.pointer.progress === "inSession"
      ? timetable.sessions[timetable.pointer.currentSession]
      : undefined;
  const currentSection =
    timetable.pointer.progress === "inSession" && currentSession
      ? currentSession.section[timetable.pointer.currentSection]
      : undefined;

  const [timerRemainSec, setTimerRemainSec] = useState<number>(0);
  const timerFullSec = currentSection?.lengthSec ?? 0;
  useInterval(() => {
    const remainSec = calcRemainTimerSec(timerFullSec, Date.now());
    console.log("count down", remainSec);
    console.log(currentSection);
    setTimerRemainSec(remainSec);
  }, 1000);

  const handleNextSession = () => {
    timetableAction.setNextSection();
    timerAction.reset(true);
  };

  return (
    <TimerBlock
      showOwnerButton={isOwner}
      remainSec={timerRemainSec}
      fullSec={timerFullSec}
      sectionTitle={currentSection?.sectionTitle ?? "発表待ち"}
      onClickNextSection={handleNextSession}
    />
  );
};
