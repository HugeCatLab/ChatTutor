import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { config } from 'dotenv'

config({ path: '../../.env' })

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      // Resolve @chat-tutor/ui internal path aliases
      '@': fileURLToPath(new URL('../ui/src', import.meta.url)),
      '#': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8001
  },
  envDir: '../../',
})
