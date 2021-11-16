import React from "react";
import { TimetableBlock } from "./TimetableBlock";
import { useTimetableCardsProps } from "../../../../lib/hooks/useSyncTimetable";

export const TimetableBlockContainer: React.VFC = () => {
  const cards = useTimetableCardsProps();
  return <TimetableBlock cards={cards} />;
};
