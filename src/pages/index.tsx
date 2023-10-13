import Main from '@/components/Main';
import Navigation from '@/components/Navigation';
import { ChakraProvider } from '@chakra-ui/react';
import mixpanel from 'mixpanel-browser';
import React from 'react';

export default function Home() {
  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
        debug: true,
        track_pageview: true,
        persistence: 'localStorage',
      });
    } else {
      console.warn('Mixpanel token not found');
    }
  }, []);

  return (
    <ChakraProvider>
      <Navigation />
      <Main />
    </ChakraProvider>
  );
}
