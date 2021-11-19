import React from "react";
import { Box, Progress, Spacer, Text, VStack } from "@chakra-ui/react";
import { secToHHMMSS, secToMMSS } from "../../../../lib/secondToString";

type TimerBlockProps = {
  remainSec: number;
  fullSec: number;
  sectionTitle: string;
  adminController?: React.ReactElement;
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
    <Box bg={"gray.200"} w={"full"} rounded={8} py={2} minWidth={0}>
      <VStack>
        <Text
          fontSize={{ base: "3xl", lg: "5xl", xl: "6xl" }}
          fontWeight={"bold"}
          textColor={remainSec >= 0 ? "gray.800" : "red.600"}
        >
          {remainTimeText}
        </Text>
        <Text
          fontSize={{ base: "1xl", xl: "2xl" }}
          fontWeight={"bold"}
          noOfLines={1}
        >
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
