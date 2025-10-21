import AuthLayout from '@/layouts/AuthLayout'
import { createBrowserRouter, Navigate } from 'react-router'
import PrivateRoute from './PrivateRoute'
import PublichRoute from './PublichRoute'
import Register from '@/pages/Auth/Register'
import Login from '@/pages/Auth/Login'
import Dashboard from '@/pages/Dashboard'
import Personnel from '@/pages/Personnel'
import Assignments from '@/pages/Assignments'
import Documents from '@/pages/Documents'
import MainLayout from '@/layouts/MainLayout'
import Profile from '@/pages/Profile'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute children={<MainLayout />}></PrivateRoute>,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'personnel',
        element: <Personnel />,
      },
      {
        path: 'assignments',
        element: <Assignments />,
      },
      {
        path: 'documents',
        element: <Documents />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    element: <PublichRoute children={<AuthLayout />}></PublichRoute>,
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
