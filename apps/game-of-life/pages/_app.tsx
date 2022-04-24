import { AppProps } from 'next/app';
import Head from 'next/head';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#333',
      },
    },
  },
});
function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to game-of-life!</title>
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default CustomApp;
