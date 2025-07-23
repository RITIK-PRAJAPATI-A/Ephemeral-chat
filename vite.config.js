import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // vite.config.js
server: {
    host: true,         // 👈 Allows access from other devices
    port: 5173,         // 👈 Optional: use a custom port
  },

})


