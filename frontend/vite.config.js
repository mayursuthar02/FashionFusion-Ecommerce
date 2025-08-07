import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://fashionfusion-ecommerce-server.onrender.com",
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    envPrefix: 'VITE_'
  }
})
