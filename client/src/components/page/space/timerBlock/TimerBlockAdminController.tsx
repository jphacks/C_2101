import React from "react";
import { Button, HStack } from "@chakra-ui/react";

export type TimerBlockAdminControllerProps = {
  isTimerEnable: boolean;
  onClickNextSection: React.MouseEventHandler<HTMLButtonElement>;
  onClickPrevSection: React.MouseEventHandler<HTMLButtonElement>;
  onClickPauseTimer: React.MouseEventHandler<HTMLButtonElement>;
  onClickResumeTimer: React.MouseEventHandler<HTMLButtonElement>;
  // onClickPauseTimer: React.MouseEventHandler<HTMLButtonElement>;
};

export const TimerBlockAdminController: React.VFC<TimerBlockAdminControllerProps> =
  ({
    onClickNextSection,
    onClickPrevSection,
    onClickPauseTimer,
    onClickResumeTimer,
    isTimerEnable,
  }) => {
    return (
      <HStack>
        <Button colorScheme={"blue"} onClick={onClickPrevSection}>
          Prev Section
        </Button>
        <Button colorScheme={"blue"} onClick={onClickNextSection}>
          Next Section
        </Button>
        {isTimerEnable && (
          <Button colorScheme={"blue"} onClick={onClickPauseTimer}>
            Pause
          </Button>
        )}
        {!isTimerEnable && (
          <Button colorScheme={"blue"} onClick={onClickResumeTimer}>
            Resume
          </Button>
        )}
      </HStack>
    );
  };
