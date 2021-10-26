import React from "react";
import { Box, Progress, Spacer, Text, VStack } from "@chakra-ui/react";

type TimerBlockProps = {
  fullSec: number;
  remainSec: number;
  sectionTitle: string;
};

const secToMMSS = (sec: number) => {
  const mm = Math.floor(sec / 60);
  const ss = sec % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
};

const secToHHMMSS = (sec: number) => {
  const hh = Math.floor(sec / 3600);
  const mm = Math.floor(sec / 60) % 60;
  const ss = sec % 60;
  return `${hh.toString().padStart(2, "0")}:${mm
    .toString()
    .padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
};

export const TimerBlock: React.VFC<TimerBlockProps> = ({
  remainSec,
  fullSec,
  sectionTitle,
}) => {
  const remainTimeText =
    fullSec < 60 * 60 ? secToMMSS(remainSec) : secToHHMMSS(remainSec);

  return (
    <Box bg={"gray.200"} w={"full"} h={56} rounded={8}>
      <VStack>
        <Text fontSize={"6xl"} fontWeight={"bold"}>
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
      </VStack>
    </Box>
  );
};
