import { createTheme, ThemeProvider } from '@mui/material';
import next from 'next';
import { AppProps } from 'next/app';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

interface CustomPageProps {
  session: Session;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#eb5c08',
    },
  },
});

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<CustomPageProps>) => {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default App;
