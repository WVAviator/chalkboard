import next from 'next';
import { AppProps } from 'next/app';
import '../styles/globals.css';

interface CustomPageProps {}

const App = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
  return <Component {...pageProps} />;
};

export default App;
