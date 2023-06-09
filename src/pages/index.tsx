import Main from '@/components/Main';
import Navigation from '@/components/Navigation';
import { ChakraProvider } from '@chakra-ui/react';

export default function Home() {
  return (
    <ChakraProvider>
      <Navigation />
      <Main />
    </ChakraProvider>
  );
}
