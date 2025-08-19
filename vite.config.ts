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
    proxy: {
      // 代理所有以 /api 开头的请求
      '/api': {
        target: 'http://localhost:8000', // 后端服务器地址
        changeOrigin: true, // 需要虚拟托管站点时添加
        rewrite: (path) => path.replace(/^\/api/, ''), // 可选，重写路径
        // 如果需要，可以添加更多配置如 secure, headers 等
      },
      // 可以添加更多代理规则
      // '/another-api': {
      //   target: 'http://another-backend-server.com',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/another-api/, ''),
      // }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 将 @ 映射为 src 目录
    },
  },
})
