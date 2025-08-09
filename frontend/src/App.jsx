import { useEffect } from 'react';
import Layout from './components/Layout'

const App = () => {
  useEffect(() => {
    localStorage.setItem('chakra-ui-color-mode', 'light');
  }, []);

  return <Layout/>
}

export default App