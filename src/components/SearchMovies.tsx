import {
  Box,
  Button,
  FormControl,
  Input,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import MoviesGrid from '../components/MoviesGrid';

type ApiResponse = {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
};

const PAGE_SIZE = 10;

const SearchMovies = () => {
  const searchBar = useRef<HTMLInputElement>(null);
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
      const url = `https://movie-database-alternative.p.rapidapi.com/?s=${query}&r=json&page=${currentPage}`;
      try {
        const headers = new Headers();
        headers.append(
          'X-RapidAPI-Key',
          process.env.NEXT_PUBLIC_RAPID_API_KEY ?? ''
        );
        headers.append(
          'X-RapidAPI-Host',
          'movie-database-alternative.p.rapidapi.com'
        );
        const response = await fetch(url, {
          method: 'GET',
          headers
        });
        const json: ApiResponse = await response.json();
        console.log('received response for page', pageToUse, json);
        if (json.Error) {
          console.error('Something went wrong when fetching from');
          console.error(url);
          console.error(json.Error);
        } else {
          setMovies(json.Search);
          setTotalResults(parseInt(json.totalResults));
        }
      } catch (error) {
        console.error('Something went wrong when fetching from');
        console.error(url);
        console.error(error);
      }
      setCurrentPage(pageToUse);
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

  return (
    <Box maxW="800px" mx="auto" my={8}>
      <form onSubmit={handleSearch}>
        <Stack direction={{ base: 'column', md: 'row' }} mb={8} spacing="4">
          <FormControl id="search">
            <Input
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies by title..."
              ref={searchBar}
              type="text"
              value={query}
            />
          </FormControl>
          <Button type="submit" colorScheme="purple">
            Search
          </Button>
        </Stack>
      </form>

      <main>
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
      </main>
    </Box>
  );
};

export default SearchMovies;
