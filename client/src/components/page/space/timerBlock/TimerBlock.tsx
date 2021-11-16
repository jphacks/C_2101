import React from "react";
import { Box, Progress, Spacer, Text, VStack } from "@chakra-ui/react";
import { secToHHMMSS, secToMMSS } from "../../../../lib/secondToString";

type TimerBlockProps = {
  remainSec: number;
  fullSec: number;
  sectionTitle: string;
  adminController?: React.ReactChildren;
};

export const TimerBlock: React.VFC<TimerBlockProps> = ({
  remainSec,
  fullSec,
  sectionTitle,
  adminController,
}) => {
  const remainTimeText =
    fullSec < 60 * 60 ? secToMMSS(remainSec) : secToHHMMSS(remainSec);

  return (
    <Box bg={"gray.200"} w={"full"} minH={48} rounded={8}>
      <VStack>
        <Text
          fontSize={"6xl"}
          fontWeight={"bold"}
          textColor={remainSec >= 0 ? "gray.800" : "red.600"}
        >
          {remainTimeText}
        </Text>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          {sectionTitle}
        </Text>
        <Spacer />
        <Progress
          w={"full"}
          colorScheme={"teal"}
          value={Math.max(remainSec / fullSec, 0) * 100}
        />
        {adminController}
      </VStack>
    </Box>
  );
};
