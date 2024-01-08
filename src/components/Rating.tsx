import { StarIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface RatingProps {
  movieId: string;
}

const Rating: React.FC<RatingProps> = ({ movieId }) => {
  const [rating, setRating] = useState<number | null>(null);

  // Load rating from local storage on mount.
  useEffect(() => {
    const storedRating = localStorage.getItem(`movie_${movieId}_rating`);
    if (storedRating) {
      setRating(parseInt(storedRating));
    }
  }, [movieId]);

  // Save rating to local storage on change.
  useEffect(() => {
    if (rating !== null) {
      localStorage.setItem(`movie_${movieId}_rating`, rating.toString());
    }
  }, [movieId, rating]);

  return (
    <Flex alignItems="center">
      {[...Array(5)].map((_, i) => {
        const starIndex = i + 1;
        const isFilled = rating !== null && starIndex <= rating;

        return (
          <IconButton
            aria-label={`Rate ${starIndex} star`}
            // It's okay to use the index as a key here
            // since the list won't change.
            key={i}
            icon={
              <StarIcon
                boxSize={6}
                color={isFilled ? "teal.500" : "gray.300"}
              />
            }
            variant="ghost"
            onClick={() => setRating(starIndex)}
          />
        );
      })}
    </Flex>
  );
};

export default Rating;
