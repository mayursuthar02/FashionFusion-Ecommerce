import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil'

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false
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
