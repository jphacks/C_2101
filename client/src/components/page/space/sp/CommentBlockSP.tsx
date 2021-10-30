import React, { useState } from "react";
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { CommentItem, CommentProps } from "../CommentItem";
import { ChevronRightIcon } from "@chakra-ui/icons";

type CommentBlockProps = {
  comments: CommentProps[];
} & CommentFormProps;

export const CommentBlock: React.VFC<CommentBlockProps> = ({
  comments,
  onSubmit,
}) => {
  return (
    <VStack w={"full"} minH={64} h={"100vh"} bg={"gray.200"} rounded={8} p={2}>
      <VStack w={"full"} h={"full"} overflowY={"scroll"}>
        {comments.map((item, index) => (
          <CommentItem {...item} key={`comment-${index}`} />
        ))}
      </VStack>
      <Spacer />
      <CommentForm onSubmit={onSubmit} />
    </VStack>
  );
};

type CommentFormProps = {
  onSubmit: (text: string) => void;
};
const CommentForm: React.VFC<CommentFormProps> = ({ onSubmit }) => {
  const [commentText, setCommentText] = useState<string>("");

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setCommentText(event.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onSubmit(commentText);
    setCommentText("");
  };

  return (
    <Box width={"100%"}>
      <form onSubmit={handleSubmit}>
        <InputGroup size={"md"}>
          <Input
            placeholder={"Comment"}
            bg={"white"}
            onChange={handleChange}
            value={commentText}
          />
          <InputRightElement>
            <IconButton
              type={"submit"}
              size={"sm"}
              aria-label={"Send comment"}
              colorScheme={"teal"}
              icon={<ChevronRightIcon />}
            />
          </InputRightElement>
        </InputGroup>
      </form>
    </Box>
  );
};
