import { Box, Link as ChakraLink, Flex, Spacer } from "@chakra-ui/react";

export default function Navigation() {
  return (
    <Flex bg="gray.800" color="white" p={4}>
      <Box>
        <ChakraLink href="/">Home</ChakraLink>
      </Box>
      <Spacer />
      <Box>
        <ChakraLink href="/bookmarked">Bookmarked</ChakraLink>
      </Box>
    </Flex>
  );
}
