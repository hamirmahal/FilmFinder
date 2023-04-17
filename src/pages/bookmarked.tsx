import MoviesGrid from '@/components/MoviesGrid';
import Navigation from '@/components/Navigation';
import { Box, ChakraProvider, Heading } from '@chakra-ui/react';

const BookmarkedMoviesPage = () => {
  return (
    <ChakraProvider>
      <Navigation />
      <Box maxW="800px" mx="auto" my={8}>
        <Heading as="h1" mb={10} size="3xl" textAlign={'center'}>
          Bookmarked Movies
        </Heading>
        <MoviesGrid />
      </Box>
    </ChakraProvider>
  );
};

export default BookmarkedMoviesPage;
