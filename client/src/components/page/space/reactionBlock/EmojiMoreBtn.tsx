import React, { useState } from "react";
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
  Grid,
} from "@chakra-ui/react";
import { FiMoreHorizontal } from "react-icons/fi";
import EmojiBtn from "./EmojiBtn";

const Emojis = Array.from(
  "😄😍😘😂😭😱😎🥺😇😺😸😻😽😼🙀😿😹😾👎👌👊✊🙏👏💩🔥✨💢👀❤️❌⭕❗❓🔰🎉🍣💯"
).filter((c) => c.charCodeAt(0) !== 65039); //ハートマークの後に処理しきれない謎Unicodeが入るため除外
const EmojiMoreBtn: React.VFC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  return (
    <>
      <Popover isLazy isOpen={isOpen} onClose={close}>
        <PopoverTrigger>
          <IconButton
            onClick={open}
            aria-label="more"
            rounded="full"
            bg="gray.300"
            color="black"
            fontSize="20px"
            icon={<FiMoreHorizontal />}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody pt={7}>
            <Grid templateColumns="repeat(5, 1fr)" gap={4}>
              {Emojis.map((emoji) => {
                return (
                  <EmojiBtn
                    emoji={emoji}
                    key={emoji}
                    onClick={() => {
                      setTimeout(() => close(), 10);
                    }}
                  />
                );
              })}
            </Grid>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
export default EmojiMoreBtn;
