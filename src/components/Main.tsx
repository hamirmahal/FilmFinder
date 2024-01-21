import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import cinemaStockImage from "../../public/cinema_stock_image.jpg";
import CustomBox from "./CustomBox";
import MoviesGrid from "./MoviesGrid";
import Search from "./Search";

type ApiResponse = {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
};

const PAGE_SIZE = 10;

const Main = () => {
  const searchBar = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
    const fetchMovies = async () => {
      const pageToUse = currentPage === -1 ? 1 : currentPage;
      const query = searchBar.current?.value;
      if (!query) return;
      const url = `/api/movies?query=${query}&page=${pageToUse}`;

      try {
        setLoading(true);
        const response = await fetch(url);
        const json: ApiResponse = await response.json();
        console.log("received response for page", pageToUse, json);
        if (json.Error) {
          console.error("Something went wrong when fetching from");
          console.error(url);
          console.error(json.Error);
          setError(json.Error);
          setCurrentPage(pageToUse);
        } else {
          setError("");
          setMovies(json.Search);
          setCurrentPage(pageToUse);
          setTotalResults(parseInt(json.totalResults));
        }
      } catch (error) {
        console.error("Something went wrong when fetching from");
        console.error(url);
        console.error(error);
        setError(`${error}`);
        setCurrentPage(pageToUse);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
    searchBar.current?.focus();
  }, [currentPage, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(-1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const search = (
    <Search
      handleSearch={handleSearch}
      query={query}
      searchBar={searchBar}
      setQuery={setQuery}
    />
  );

  if (error) {
    return (
      <CustomBox>
        {search}
        <Box h="80vh" justifyContent="center" alignItems="center">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" color="red.500">
              Error: {error}
            </Heading>
          </Box>
        </Box>
      </CustomBox>
    );
  }

  return (
    <CustomBox>
      {search}
      <main>
        {loading || movies.length ? (
          <>
            <MoviesGrid movies={movies} passedMoviesAreLoading={loading} />
            {movies.length > 0 && (
              <Stack
                direction="row"
                justifyContent={"center"}
                spacing="4"
                mt={14}
                align="center"
              >
                {currentPage > 1 && (
                  <Button onClick={handlePreviousPage}>Previous</Button>
                )}
                <Text>
                  {currentPage} of {Math.ceil(totalResults / PAGE_SIZE)}
                </Text>
                {currentPage * PAGE_SIZE < totalResults && (
                  <Button onClick={handleNextPage}>Next</Button>
                )}
              </Stack>
            )}
          </>
        ) : (
          <Flex
            as="header"
            align="center"
            justify="center"
            h={{ lg: "80vh" }}
            minH={{ lg: 600 }}
          >
            <Box textAlign="center">
              <Heading as="h1" size="3xl">
                Welcome to FilmFinder!
              </Heading>
              <Text fontSize="xl" my={10}>
                Get started by searching above.
              </Text>
              <Box maxW="2xl" mx="auto">
                <Image
                  alt={"cinema stock image"}
                  // Since this is above the fold, load this image eagerly.
                  priority
                  src={cinemaStockImage}
                />
              </Box>
            </Box>
          </Flex>
        )}
      </main>
    </CustomBox>
  );
};

export default Main;
