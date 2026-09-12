import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all local IP addresses (0.0.0.0) for mobile testing
    port: 5173,
    allowedHosts: true // Allow localtunnel / ngrok / external hosts for mobile testing
  }
})