import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout'
import { createBrowserRouter, Navigate } from 'react-router'
import PrivateRoute from './PrivateRoute'
import Register from '@/pages/Auth/Register'
import Login from '@/pages/Auth/Login'
import Dashboard from '@/pages/Dashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard></Dashboard>,
      },
    ],
  },
  {
    element: <AuthLayout />,
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
