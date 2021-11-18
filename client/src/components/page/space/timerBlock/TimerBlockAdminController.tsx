import React from "react";
import { Box, Button } from "@chakra-ui/react";

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
      <Box>
        <Button colorScheme={"teal"} onClick={onClickNextSection}>
          Next Section
        </Button>
        <Button colorScheme={"teal"} onClick={onClickPrevSection}>
          Prev Section
        </Button>
        {isTimerEnable && (
          <Button colorScheme={"teal"} onClick={onClickPauseTimer}>
            Pause
          </Button>
        )}
        {!isTimerEnable && (
          <Button colorScheme={"teal"} onClick={onClickResumeTimer}>
            Resume
          </Button>
        )}
      </Box>
    );
  };
