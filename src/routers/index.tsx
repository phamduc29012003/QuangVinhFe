import { createBrowserRouter, Navigate } from 'react-router'
import DeviceRouter from './DeviceRouter/DeviceRouter'
import PrivateRoute from './RoleRoute/PrivateRoute'
import PublichRoute from './RoleRoute/PublichRoute'
import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout'
import MobileLayout from '@/layouts/MobileLayout'
import { Login, Register } from '@/pages'
import { WebRoutes } from './DeviceRouter/WebRoute'
import { MobileRoutes } from './DeviceRouter/MobileRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <DeviceRouter children={<PrivateRoute children={<MainLayout />} />} />,
    children: WebRoutes,
  },
  {
    path: '/mobile',
    element: <DeviceRouter children={<PrivateRoute children={<MobileLayout />} />} />,
    children: MobileRoutes,
  },
  {
    element: <PublichRoute children={<AuthLayout />} />,
    path: '/login',
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    path: '/register',
    children: [
      {
        index: true,
        element: <Register />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])

export default router
