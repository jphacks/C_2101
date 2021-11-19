import React from "react";
import { Button, HStack } from "@chakra-ui/react";

type Props = {
  onClickStartScreenShare: React.MouseEventHandler<HTMLButtonElement>;
  onClickEndScreenShare: React.MouseEventHandler<HTMLButtonElement>;
};

export const ScreenBlockMenu: React.VFC<Props> = ({
  onClickEndScreenShare,
  onClickStartScreenShare,
}) => {
  return (
    <HStack>
      <Button colorScheme={"blue"} onClick={onClickStartScreenShare}>
        画面共有を開始
      </Button>
      <Button colorScheme={"blue"} onClick={onClickEndScreenShare}>
        画面共有を終了
      </Button>
    </HStack>
  );
};
