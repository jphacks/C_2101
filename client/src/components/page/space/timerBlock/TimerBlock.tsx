import React from "react";
import { Box, Button, Progress, Spacer, Text, VStack } from "@chakra-ui/react";

type TimerBlockProps = {
  remainSec: number;
  fullSec: number;
  sectionTitle: string;
  showOwnerButton: boolean;
  onClickNextSection: React.MouseEventHandler<HTMLButtonElement>;
};

const secToMMSS = (sec: number) => {
  const mm = Math.floor(Math.abs(sec) / 60);
  const ss = Math.abs(sec) % 60;
  return `${sec < 0 ? "-" : ""}${mm.toString().padStart(2, "0")}:${ss
    .toString()
    .padStart(2, "0")}`;
};

const secToHHMMSS = (sec: number) => {
  const hh = Math.floor(Math.abs(sec) / 3600);
  const mm = Math.floor(Math.abs(sec) / 60) % 60;
  const ss = Math.abs(sec) % 60;
  return `${sec < 0 ? "-" : ""}${hh.toString().padStart(2, "0")}:${mm
    .toString()
    .padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
};

export const TimerBlock: React.VFC<TimerBlockProps> = ({
  remainSec,
  fullSec,
  sectionTitle,
  showOwnerButton,
  onClickNextSection,
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
        {showOwnerButton && (
          <Box>
            <Button onClick={onClickNextSection} colorScheme={"teal"}>
              Next Section
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  );
};