import React from "react";
import { Box, Text } from "@chakra-ui/react";

type ReactionBadgeProps = {
  reactionEmoji: string;
  size: string;
};
export const AvatarReactionBadge: React.VFC<ReactionBadgeProps> = ({
  reactionEmoji,
  size,
}) => {
  return (
    <Box
      position={"absolute"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      insetEnd={"-8px"}
      bottom={"-8px"}
    >
      <Text fontSize={size}>{reactionEmoji}</Text>
    </Box>
  );
};
