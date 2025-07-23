import { lazy } from 'react'
import App from '@/App'
import { createBrowserRouter } from 'react-router-dom'
// 使用懒加载提高性能（可选）
const MapWork = lazy(() => import('@/pages/MapWork'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // 直接使用组件而不是箭头函数
    children: [
      {
        index: true, // 默认子路由
        element: <MapWork /> // 或者替换为你实际的主页组件
      },
      
      // 可以继续添加更多子路由
    ]
  },
  {
    path: '*',
    element: <div>404 页面未找到</div>
  }
])

export default router