import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil'

const styles = {
  global:(props) => ({
    body:{
      color:mode('gray.800','White')(props),
      bg:mode('gray.100', '#121212')(props),
    }
  })
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: true
};

const theme = extendTheme({ config });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>,
)
