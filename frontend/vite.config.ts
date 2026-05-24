import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // allow all hosts to access the dev server
  server: {
    // host: true,
    allowedHosts: true,
  },
})
