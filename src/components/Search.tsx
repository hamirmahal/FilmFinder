"use client";

import { Button, FormControl, Input, Stack } from "@chakra-ui/react";
import React from "react";

interface SearchProps {
  handleSearch: (e: React.FormEvent) => void;
  searchBar: React.RefObject<HTMLInputElement>;
}

const Search: React.FC<SearchProps> = ({ handleSearch, searchBar }) => {
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        searchBar.current?.focus();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [searchBar]);

  return (
    <form onSubmit={handleSearch}>
      <Stack direction={{ base: "column", md: "row" }} mb={8} spacing="4">
        <FormControl id="search-FilmFinder">
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
