import styles from '@/styles/Home.module.css';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  List
} from '@chakra-ui/react';
import { FormEvent, useState } from 'react';
import MoviesGrid from './MoviesGrid';

const SearchMovies = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<any[]>([]);

  const searchMovies = async () => {
    const url = new URL('https://movie-database-alternative.p.rapidapi.com/');
    const params = new URLSearchParams({
      s: query,
      r: 'json',
      page: '1'
    });

    url.search = params.toString();

    if (!process.env.NEXT_PUBLIC_RAPID_API_KEY) {
      console.error('Error: no Rapid API key found');
      return;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
        'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
      }
    });

    const data = await response.json();
    console.log(data);
    if (data.Search) {
      setMovies(data.Search);
    } else {
      setMovies([]);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    searchMovies();
  };

  return (
    <>
      <Box maxWidth="600px" mx="auto" mt={8}>
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <InputLeftElement pointerEvents="none" />
            <Input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies by title..."
              size="lg"
              borderRadius="full"
              _focus={{ borderColor: 'gray.300' }}
            />
            <Button type="submit" colorScheme="blue" size="lg" ml={2}>
              Search
            </Button>
          </InputGroup>
        </form>
      </Box>

      <main className={styles.main}>
        <List mt={8}>
          <MoviesGrid movies={movies} />
        </List>
      </main>
    </>
  );
};

export default SearchMovies;
