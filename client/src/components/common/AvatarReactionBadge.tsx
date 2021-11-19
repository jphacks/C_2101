import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { Twemoji } from "./Emoji/Twemoji";
import { shake } from "./Emoji/shakeCSSkyeframe";

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
      animation={`${shake} 1 0.8s ease-in-out`}
      key={reactionEmoji} //keyの変更でanimeが再度走る
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
