import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
  server: {
    // Enable history API fallback for client-side routing
    historyApiFallback: true,
  },
  preview: {
    // Enable history API fallback for preview mode
    historyApiFallback: true,
  }
})
