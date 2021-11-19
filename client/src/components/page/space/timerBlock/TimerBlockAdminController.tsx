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
      <HStack w={"full"} px={2} justify="space-between">
        <Button colorScheme={"blue"} width={28} onClick={onClickPrevSection}>
          Prev Section
        </Button>
        <Button colorScheme={"blue"} width={28} onClick={onClickNextSection}>
          Next Section
        </Button>
        {isTimerEnable && (
          <Button colorScheme={"blue"} width={20} onClick={onClickPauseTimer}>
            Pause
          </Button>
        )}
        {!isTimerEnable && (
          <Button colorScheme={"blue"} width={20} onClick={onClickResumeTimer}>
            Resume
          </Button>
        )}
      </HStack>
    );
  };
