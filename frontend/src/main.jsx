import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil'

const config = {
  initialColorMode: "light",
  useSystemColorMode: false
};

const theme = extendTheme({ config });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <BrowserRouter>
            <App />
          </BrowserRouter>
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>,
)
