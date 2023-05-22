import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import MoviesGrid from './MoviesGrid';
import Search from './Search';

type ApiResponse = {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
};

const MILLISECONDS_IN_1_DAY = 24 * 3600 * 1000;
const PAGE_SIZE = 10;

const SearchMovies = () => {
  const searchBar = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
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
      const localStorageKey = `${query}-${pageToUse}`;
      const item = localStorage.getItem(localStorageKey);
      if (item) {
        const data = JSON.parse(item);
        const { timestamp } = data;
        const timeSinceLastRequest = Date.now() - timestamp;
        if (timeSinceLastRequest < MILLISECONDS_IN_1_DAY) {
          setError('');
          setMovies(data.Search);
          setCurrentPage(pageToUse);
          setTotalResults(data.totalResults);
          console.info('using cached results for', localStorageKey);
          return;
        }
      }

      try {
        const response = await fetch(url);
        const json: ApiResponse = await response.json();
        console.log('received response for page', pageToUse, json);
        if (json.Error) {
          console.error('Something went wrong when fetching from');
          console.error(url);
          console.error(json.Error);
          setError(json.Error);
          setCurrentPage(pageToUse);
        } else {
          setError('');
          setMovies(json.Search);
          setCurrentPage(pageToUse);
          setTotalResults(parseInt(json.totalResults));
          const item = { ...json, timestamp: Date.now() };
          localStorage.setItem(localStorageKey, JSON.stringify(item));
        }
      } catch (error) {
        console.error('Something went wrong when fetching from');
        console.error(url);
        console.error(error);
        setError(`${error}`);
        setCurrentPage(pageToUse);
      }
    };
    fetchMovies();
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

  if (error) {
    return (
      <Box maxW="800px" mx="auto" my={8}>
        <Search
          handleSearch={handleSearch}
          query={query}
          searchBar={searchBar}
          setQuery={setQuery}
        />
        <Box h="80vh" justifyContent="center" alignItems="center">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" color="red.500">
              Error: {error}
            </Heading>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" my={8}>
      <Search
        handleSearch={handleSearch}
        query={query}
        searchBar={searchBar}
        setQuery={setQuery}
      />
      <main>
        {movies.length ? (
          <>
            <MoviesGrid movies={movies} />
            {movies.length > 0 && (
              <Stack
                direction="row"
                justifyContent={'center'}
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
            h={{ lg: '80vh' }}
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
                  alt={'cinema stock image'}
                  src={'/cinema_stock_image.jpg'}
                />
              </Box>
            </Box>
          </Flex>
        )}
      </main>
    </Box>
  );
};

export default SearchMovies;
