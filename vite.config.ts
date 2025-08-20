import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import inspector from 'vite-plugin-dev-inspector'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), inspector({
    toggleButtonVisibility: 'never', // 始终显示切换按钮
    enabled: true,                    // 默认启用检查器
  }),],
  build: {
    sourcemap: true, // 确保开发和生产环境都启用（开发模式默认开启）
  },
  server: {
    port: 2020, // 改为你想要的端口号
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 将 @ 映射为 src 目录
    },
  },
})
