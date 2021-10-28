import { HStack } from "@chakra-ui/react";
import React from "react";
import { TimetableCard, TimetableCardProps } from "./TimetableCard";

type TimetableBlockProps = {
  cards: TimetableCardProps[];
};

export const TimetableBlock: React.VFC<TimetableBlockProps> = ({ cards }) => {
  return (
    <HStack
      bg={"gray.200"}
      w={"100%"}
      h={96}
      p={4}
      spacing={4}
      rounded={8}
      overflowX={"scroll"}
    >
      {cards.map((item) => (
        <TimetableCard
          key={`timetable-card-${item.user.id}-${item.title}`}
          {...item}
        />
      ))}
    </HStack>
  );
};
