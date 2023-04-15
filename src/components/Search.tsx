import { Button, FormControl, Input, Stack } from '@chakra-ui/react';
import React from 'react';

interface SearchProps {
  handleSearch: (e: React.FormEvent) => void;
  searchBar: React.RefObject<HTMLInputElement>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<SearchProps> = ({
  handleSearch,
  query,
  searchBar,
  setQuery
}) => {
  return (
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
  );
};

export default Search;
