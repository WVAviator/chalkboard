import { createTheme, ThemeProvider } from '@mui/material';
import next from 'next';
import { AppProps } from 'next/app';
import '../styles/globals.css';

interface CustomPageProps {}

const theme = createTheme({
  palette: {
    primary: {
      main: '#eb5c08',
    },
  },
});

const App = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
