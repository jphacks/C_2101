import React from "react";
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
} from "@chakra-ui/react";
// import VolumeHighIcon from "mdi-react/VolumeHighIcon";
import { FiMoreHorizontal } from "react-icons/fi";

type ConfigBlockProps = {};

const EmojiMoreBtn: React.VFC<{}> = () => {
  return (
    <>
      <Popover isLazy>
        <PopoverTrigger>
          <IconButton
            aria-label="more"
            rounded="full"
            bg="gray.300"
            color="black"
            fontSize="20px"
            icon={<FiMoreHorizontal />}
          />
        </PopoverTrigger>
        <PopoverContent>
          {/* <PopoverHeader fontWeight="semibold">Popover placement</PopoverHeader> */}
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            😄😍😘😂😭😱😎🥺😇 😺😸😻😽😼🙀😿😹😾 💩🔥✨💢 👀❤️ 👍👎👌👊✊🙏👏
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
export default EmojiMoreBtn;
