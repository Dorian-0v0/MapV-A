import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reactClickToComponent } from "vite-plugin-react-click-to-component";
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reactClickToComponent()],
  server: {
    port: 2020, // 改为你想要的端口号
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 将 @ 映射为 src 目录
    },
  },
})
