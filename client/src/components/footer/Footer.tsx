import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      color={useColorModeValue("gray.700", "gray.200")}
      borderTopWidth={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.700")}
      width="100%"
      height="50px"
      position="absolute"
      bottom="0"
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={3}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "center" }}
        align={{ base: "center", md: "center" }}
      >
        <Text color={"gray.500"}>© 2021 LT Space. All rights reserved</Text>
      </Container>
    </Box>
  );
}
