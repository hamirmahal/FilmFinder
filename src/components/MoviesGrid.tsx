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
import Rating from './Rating';

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
    localStorage.setItem(isWatchedKey, `${!watched}`);
    setWatched(!watched);
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" maxW={300} overflow="hidden">
      <Image
        alt={movie.Title}
        src={
          movie.Poster === 'N/A' ? '/poster_not_available.png' : movie.Poster
        }
      />

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
            ml="1"
            mt="2"
            size="sm"
            colorScheme={watched ? 'yellow' : 'gray'}
            onClick={handleWatched}
          >
            {watched ? 'Watched' : 'Not Watched'}
          </Button>
        )}
        {isBookmarked && watched && <Rating movieId={movie.imdbID} />}
      </Box>
    </Box>
  );
};

type MoviesProps = {
  movies: Movie[];
};

const MoviesGrid = ({ movies }: MoviesProps) => {
  const localStorageExists = typeof window !== 'undefined';
  const [bookmarks, setBookmarks] = useState<Set<string>>(
    localStorageExists
      ? new Set(JSON.parse(localStorage.getItem('bookmarks') || '[]'))
      : new Set()
  );

  const handleBookmark = (movie: Movie) => {
    const element = JSON.stringify(movie);
    if (bookmarks.has(element)) {
      setBookmarks((bookmarks) => {
        const newBookmarks = new Set(bookmarks);
        newBookmarks.delete(element);
        return newBookmarks;
      });
    } else {
      setBookmarks((bookmarks) => {
        const newBookmarks = new Set(bookmarks);
        newBookmarks.add(element);
        return newBookmarks;
      });
    }
  };

  if (localStorageExists) {
    const localStorageValue = JSON.stringify(Array.from(bookmarks));
    localStorage.setItem('bookmarks', localStorageValue);
  }

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      {movies.map((movie) => (
        <GridItem key={movie.imdbID} m={'auto'}>
          <MovieCard
            movie={movie}
            isBookmarked={bookmarks.has(JSON.stringify(movie))}
            onBookmark={handleBookmark}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default MoviesGrid;
