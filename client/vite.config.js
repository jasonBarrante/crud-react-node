import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración Vite
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
