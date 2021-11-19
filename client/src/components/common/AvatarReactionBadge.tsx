import React from "react";
import { Box } from "@chakra-ui/react";
import { Twemoji } from "./Emoji/Twemoji";

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
      boxSize={size}
      insetEnd={"-8px"}
      bottom={"-8px"}
    >
      <Twemoji emoji={reactionEmoji} />
    </Box>
  );
};
