import { TimerBlock } from "./TimerBlock";
import React from "react";
import {
  useTimetableAction,
  useTimetableCurrentSection,
} from "../../../../states/useSyncTimetable";
import {
  useTimerAction,
  useTimerRemainSec,
} from "../../../../states/useSyncTimer";
import { useIsOwner } from "../../../../states/useUserInRoom";

export const TimerBlockContainer: React.VFC = () => {
  const currentSection = useTimetableCurrentSection();
  const fullSec =
    currentSection.type === "speaking" ? currentSection.estimateTimeSec : 0;
  const remainSec = useTimerRemainSec(fullSec);

  const isOwner = useIsOwner();

  const { moveNextSection } = useTimetableAction();
  const {} = useTimerAction();

  const handleNextSession = () => {
    // timetableAction.setNextSection();
    // timerAction.reset(true);
  };

  if (currentSection.type === "speaking") {
    return (
      <TimerBlock
        remainSec={remainSec}
        fullSec={fullSec}
        sectionTitle={currentSection.sectionTitle}
      />
    );
  } else {
    return (
      <TimerBlock remainSec={remainSec} fullSec={fullSec} sectionTitle={""} />
    );
  }
};
