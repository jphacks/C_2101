import React from "react";
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { CommentItem, CommentProps } from "./commentItem";
import { ChevronRightIcon } from "@chakra-ui/icons";

type CommentBlockProps = {
  comments: CommentProps[];
};

export const CommentBlock: React.VFC<CommentBlockProps> = ({ comments }) => {
  return (
    <VStack w={"full"} h={"full"} bg={"gray.200"} rounded={8} p={2}>
      <VStack h={"full"} overflowY={"scroll"}>
        {comments.map((item, index) => (
          <CommentItem {...item} key={`comment-${index}`} />
        ))}
      </VStack>
      <Spacer />
      <Box width={"100%"}>
        {/*後で分離*/}
        <InputGroup size={"md"} bg={"white"}>
          <Input placeholder={"Comment"} />
          <InputRightElement>
            <IconButton
              aria-label={"Send comment"}
              colorScheme={"teal"}
              icon={<ChevronRightIcon />}
            />
          </InputRightElement>
        </InputGroup>
      </Box>
    </VStack>
  );
};
