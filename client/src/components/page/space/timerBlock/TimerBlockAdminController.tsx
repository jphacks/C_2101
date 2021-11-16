import React from "react";
import { Box, Button } from "@chakra-ui/react";

export type TimerBlockAdminControllerProps = {
  onClickNextSection: React.MouseEventHandler<HTMLButtonElement>;
};

export const TimerBlockAdminController: React.VFC<TimerBlockAdminControllerProps> =
  ({}) => {
    return (
      <Box>
        <Button colorScheme={"teal"}>Next Section</Button>
        <Button colorScheme={"teal"}>Prev Section</Button>
      </Box>
    );
  };
