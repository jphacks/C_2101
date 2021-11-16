import React, { useMemo } from "react";
import twemoji from "twemoji";

type props = { emoji: string };
export const Twemoji: React.VFC<props> = ({ emoji }) => {
  return useMemo(
    () => (
      <span
        dangerouslySetInnerHTML={{
          __html: twemoji.parse(emoji, {
            folder: "svg",
            ext: ".svg",
          }),
        }}
      />
    ),
    [emoji]
  );
};
