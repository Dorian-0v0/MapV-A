import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inspector from 'vite-plugin-dev-inspector'
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), inspector({
     toggleButtonVisibility: 'never', //隐藏调试按钮
    launchEditor: "code" // 默认为vscode
  })],
  server: {
    port: 2020, // 改为你想要的端口号
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 将 @ 映射为 src 目录
    },
  },
})
