import {
  Box,
  Button,
  Grid,
  GridItem,
  Image,
  Text,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

type MovieProps = {
  movie: Movie;
  isBookmarked: boolean;
  onBookmark: (movie: Movie) => void;
};

const MovieCard = ({ movie, isBookmarked, onBookmark }: MovieProps) => {
  const localStorageExists = typeof window !== 'undefined';
  const isWatchedKey = `${movie.imdbID} watched`;
  const toast = useToast();
  const [watched, setWatched] = useState(
    localStorageExists
      ? localStorage.getItem(isWatchedKey) === 'true' || false
      : false
  );

  const handleBookmark = () => {
    onBookmark(movie);
    toast({
      title: isBookmarked
        ? `${movie.Title} bookmark removed.`
        : `${movie.Title} bookmarked!`,
      status: 'success',
      duration: 2000,
      isClosable: true
    });
  };

  const handleWatched = () => {
    toast({
      title: watched
        ? `${movie.Title} marked as not watched.`
        : `${movie.Title} marked as watched!`,
      status: 'success',
      duration: 2000,
      isClosable: true
    });
    localStorage.setItem(isWatchedKey, `${!watched}`);
    setWatched(!watched);
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={movie.Poster} alt={movie.Title} />

      <Box p="6">
        <Box alignItems="baseline">
          <Text fontSize="sm" fontWeight="bold" color="gray.500">
            {movie.Year}
          </Text>
        </Box>

        <Text mt="1" fontWeight="semibold" lineHeight="tight" isTruncated>
          {movie.Title}
        </Text>

        <Button
          mt="2"
          size="sm"
          colorScheme={isBookmarked ? 'yellow' : 'gray'}
          onClick={handleBookmark}
        >
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </Button>
        {isBookmarked && (
          <Button
            mt="2"
            size="sm"
            colorScheme={watched ? 'yellow' : 'gray'}
            onClick={handleWatched}
          >
            {watched ? 'Watched' : 'Not Watched'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

type MoviesProps = {
  movies: Movie[];
};

const MoviesGrid = ({ movies }: MoviesProps) => {
  const localStorageExists = typeof window !== 'undefined';
  const [bookmarks, setBookmarks] = useState<string[]>(
    JSON.parse(
      localStorageExists ? localStorage.getItem('bookmarks') || '[]' : '[]'
    )
  );

  const handleBookmark = (movie: Movie) => {
    const index = bookmarks.indexOf(movie.imdbID);
    if (index === -1) {
      setBookmarks((bookmarks) => [...bookmarks, movie.imdbID]);
    } else {
      setBookmarks((bookmarks) =>
        bookmarks.filter((id) => id !== movie.imdbID)
      );
    }
  };

  if (localStorageExists) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
      {movies.map((movie) => (
        <GridItem key={movie.imdbID}>
          <MovieCard
            movie={movie}
            isBookmarked={bookmarks.includes(movie.imdbID)}
            onBookmark={handleBookmark}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default MoviesGrid;
