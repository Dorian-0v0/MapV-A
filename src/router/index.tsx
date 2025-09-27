import { lazy } from 'react'
import App from '@/App'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
// 使用懒加载提高性能（可选）
const MapWork = lazy(() => import('@/pages/MapWork'))
const DataCenter = lazy(() => import('@/pages/DataCenter'))
const UserSetting = lazy(() => import('@/pages/UserSetting'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // 直接使用组件而不是箭头函数
    children: [
      {
        path: '/mapwork',
        element: <MapWork /> // 或者替换为你实际的主页组件
      },
      {
        path: '/datacenter',
        element: <DataCenter /> // 或者替换为你实际的数据中心组件
      },
      {
        path: '/user',
        element: <UserSetting /> // 或者替换为你实际的用户设置组件
      },
      {
        path: '/',
        element: <Navigate to="/mapwork" replace />
      },
      { // 404 页面
        path:"*",
        element: <div>404 Not Found</div>
      },
      
      // 可以继续添加更多子路由
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '*',
    element: <div>404 页面未找到</div>
  }
])

export default router