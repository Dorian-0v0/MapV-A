import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 将 @ 映射为 src 目录
    },
  },
})
