import SearchMovies from '@/components/Main';
import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';

export default function Home() {
  return (
    <ChakraProvider>
      <Head>
        <title>FilmFinder</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchMovies />
    </ChakraProvider>
  );
}
