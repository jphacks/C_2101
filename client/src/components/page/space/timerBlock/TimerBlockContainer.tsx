import { TimerBlock } from "./TimerBlock";
import React from "react";
import {
  useTimetableAction,
  useTimetableCurrentSection,
} from "../../../../lib/hooks/useSyncTimetable";
import {
  useTimerAction,
  useTimerIsEnabled,
  useTimerRemainSec,
} from "../../../../lib/hooks/useSyncTimer";
import { useIsOwner } from "../../../../lib/hooks/useUserInRoom";
import { TimetableSection } from "@api-schema/types/timetableState";
import { TimerBlockAdminController } from "./TimerBlockAdminController";

export const TimerBlockContainer: React.VFC = () => {
  const currentSection = useTimetableCurrentSection();
  const fullSec =
    currentSection?.type === "speaking" ? currentSection.estimateTimeSec : 0;
  const remainSec = useTimerRemainSec(fullSec);
  const timerIsEnabled = useTimerIsEnabled();

  const isOwner = useIsOwner();

  const { moveNextSection, movePrevSection } = useTimetableAction();
  const { pause, resume } = useTimerAction();

  const handleNextSession = () => {
    // timetableAction.setNextSection();
    // timerAction.reset(true);
  };

  return (
    <TimerBlock
      remainSec={remainSec}
      fullSec={fullSec}
      sectionTitle={getTitle(currentSection)}
      adminController={
        isOwner ? (
          <TimerBlockAdminController
            isTimerEnable={timerIsEnabled}
            onClickNextSection={moveNextSection}
            onClickPrevSection={movePrevSection}
            onClickPauseTimer={pause}
            onClickResumeTimer={resume}
          />
        ) : undefined
      }
    />
  );
};

const getTitle = (section: TimetableSection | null): string => {
  if (!section) {
    return "";
  }
  if (section.type === "startPreparation") {
    return "開始までお待ちください";
  }
  if (section.type === "speaking") {
    return section.sectionTitle;
  }
  if (section.type === "between") {
    return "次の発表までお待ちください";
  }
  if (section.type === "closed") {
    return "発表は終了しました";
  }
  return "";
};
