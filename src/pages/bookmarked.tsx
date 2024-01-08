import CustomBox from "@/components/CustomBox";
import MoviesGrid from "@/components/MoviesGrid";
import Navigation from "@/components/Navigation";
import { ChakraProvider, Heading } from "@chakra-ui/react";

const BookmarkedMoviesPage = () => {
  return (
    <ChakraProvider>
      <Navigation />
      <CustomBox>
        <Heading as="h1" mb={10} size="3xl" textAlign={"center"}>
          Bookmarked Movies
        </Heading>
        <MoviesGrid />
      </CustomBox>
    </ChakraProvider>
  );
};

export default BookmarkedMoviesPage;
