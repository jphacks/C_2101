import React, { useCallback, useState } from "react";
import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Grid,
} from "@chakra-ui/react";
import { FiMoreHorizontal } from "react-icons/fi";
import EmojiBtn from "./EmojiBtn";

const Emojis = Array.from(
  "๐๐๐๐๐ญ๐ฑ๐๐ฅบ๐๐บ๐ธ๐ป๐ฝ๐ผ๐๐ฟ๐น๐พ๐๐๐โ๐๐๐ฉ๐ฅโจ๐ข๐โค๏ธโโญโโ๐ฐ๐๐ฃ๐ฏ"
).filter((c) => c.charCodeAt(0) !== 65039); //ใใผใใใผใฏใฎๅพใซๅฆ็ใใใใชใ่ฌUnicodeใๅฅใใใ้คๅค

type Props = {
  onClickEmoji: (emoji: string) => void;
};

const EmojiMoreBtn: React.VFC<Props> = ({ onClickEmoji }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const handleClickEmoji = useCallback(
    (emoji: string) => {
      onClickEmoji(emoji);
      setTimeout(() => close(), 10);
    },
    [onClickEmoji]
  );

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
                    onClickEmoji={handleClickEmoji}
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
