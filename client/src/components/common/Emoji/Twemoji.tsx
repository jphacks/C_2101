import React, { memo } from "react";
import twemoji from "twemoji";

type props = { emoji: string };
const Twemoji: React.VFC<props> = ({ emoji }) => (
  <span
    dangerouslySetInnerHTML={{
      __html: twemoji.parse(emoji, {
        folder: "svg",
        ext: ".svg",
      }),
    }}
  />
);

export default memo(Twemoji); //memoは再レンダリングされないreactの構文らしい
