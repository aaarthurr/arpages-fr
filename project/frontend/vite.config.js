import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,  // Better file watching in Docker
      interval: 100
    },
    hmr: {
      host: 'localhost'  // Hot Module Replacement
    }
  }
})
