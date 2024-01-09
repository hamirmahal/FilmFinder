import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  Image,
  Spinner,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Rating from "./Rating";

type MovieProps = {
  movie: Movie;
  isBookmarked: boolean;
  onBookmark: (movie: Movie) => void;
};

const MovieCard = ({ movie, isBookmarked, onBookmark }: MovieProps) => {
  const [errorLoadingImgSrc, setErrorLoadingImgSrc] = useState(false);
  const [imageIsLoaded, setImageIsLoaded] = useState(false);
  const localStorageExists = typeof window !== "undefined";
  const isWatchedKey = `${movie.imdbID} watched`;
  const toast = useToast();
  const [watched, setWatched] = useState(
    localStorageExists
      ? localStorage.getItem(isWatchedKey) === "true" || false
      : false
  );

  const handleBookmark = () => {
    onBookmark(movie);
    toast({
      title: isBookmarked
        ? `${movie.Title} bookmark removed.`
        : `${movie.Title} bookmarked!`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleWatched = () => {
    localStorage.setItem(isWatchedKey, `${!watched}`);
    setWatched(!watched);
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" maxW={300} overflow="hidden">
      <Box position="relative" height={400} width={300}>
        <Image
          alt={movie.Title}
          height={400}
          onError={() => setErrorLoadingImgSrc(true)}
          onLoad={() => setImageIsLoaded(true)}
          src={
            errorLoadingImgSrc || movie.Poster === "N/A"
              ? "/poster_not_available.png"
              : movie.Poster
          }
          width={300}
        />
        {!imageIsLoaded && (
          <Center
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={1}
          >
            <Spinner size="xl" />
          </Center>
        )}
      </Box>

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
          colorScheme={isBookmarked ? "yellow" : "gray"}
          onClick={handleBookmark}
        >
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </Button>
        {isBookmarked && (
          <Button
            ml="1"
            mt="2"
            size="sm"
            colorScheme={watched ? "yellow" : "gray"}
            onClick={handleWatched}
          >
            {watched ? "Watched" : "Not Watched"}
          </Button>
        )}
        {isBookmarked && watched && <Rating movieId={movie.imdbID} />}
      </Box>
    </Box>
  );
};

type MoviesProps = {
  /**
   * Movies will be bookmarked local storage
   * movies if they are not provided by the parent.
   */
  movies?: Movie[];
  passedMoviesAreLoading?: boolean;
};

const MoviesGrid = ({ movies, passedMoviesAreLoading }: MoviesProps) => {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [isSmallerThan700] = useMediaQuery("(max-width: 700px)");
  const [loading, setLoading] = useState(true);

  const handleBookmark = (movie: Movie) => {
    const element = JSON.stringify(movie);
    if (bookmarks.has(element)) {
      setBookmarks((bookmarks) => {
        const newBookmarks = new Set(bookmarks);
        newBookmarks.delete(element);
        const localStorageValue = JSON.stringify(Array.from(newBookmarks));
        localStorage.setItem("bookmarks", localStorageValue);
        return newBookmarks;
      });
    } else {
      setBookmarks((bookmarks) => {
        const newBookmarks = new Set(bookmarks);
        newBookmarks.add(element);
        const localStorageValue = JSON.stringify(Array.from(newBookmarks));
        localStorage.setItem("bookmarks", localStorageValue);
        return newBookmarks;
      });
    }
  };

  // Since `useEffect` is only executed in the browser, we can use this to
  // correctly get bookmarked movies without creating a discrepancy between
  // the first client-side render and the pre-rendered HTML from the server.
  // https://nextjs.org/docs/messages/react-hydration-error#possible-ways-to-fix-it
  useEffect(() => {
    setBookmarks(
      new Set(JSON.parse(localStorage.getItem("bookmarks") ?? "[]"))
    );
    setLoading(false);
  }, []);

  const bookmarkedMovies = Array.from(bookmarks).map((movieStr) =>
    JSON.parse(movieStr)
  ) as Movie[];
  const moviesToDisplay = movies ?? bookmarkedMovies;
  let content: JSX.Element;

  // If `movies` aren't present, that means we're using bookmarked movies,
  // so we just fall back to the loading state for bookmarked movies.
  if ((movies && passedMoviesAreLoading) || loading) {
    content = (
      <Center>
        <Spinner size={"xl"} />
      </Center>
    );
  } else if (moviesToDisplay.length > 0) {
    content = (
      <Grid
        gap={6}
        templateColumns={isSmallerThan700 ? "repeat(1, 1fr)" : "repeat(2, 1fr)"}
      >
        {moviesToDisplay.map((movie) => (
          <GridItem key={movie.imdbID} height={580} mx={"auto"}>
            <MovieCard
              movie={movie}
              isBookmarked={bookmarks.has(JSON.stringify(movie))}
              onBookmark={handleBookmark}
            />
          </GridItem>
        ))}
      </Grid>
    );
  } else {
    content = (
      <Box
        bg="gray.100"
        borderRadius="md"
        color="gray.600"
        fontSize="xl"
        fontWeight="semibold"
        p={4}
        textAlign="center"
      >
        <Heading as="h2" mb={4} size="md">
          No bookmarked movies!
        </Heading>
        <p>
          Start bookmarking your favorite movies by clicking the
          &quot;Bookmark&quot; button.
        </p>
      </Box>
    );
  }

  return content;
};

export default MoviesGrid;
