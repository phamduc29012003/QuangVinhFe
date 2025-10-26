import { type RouteObject, Navigate } from 'react-router'
import {
  DashboardMobile,
  PersonnelMobile,
  AssignmentsMobile,
  DocumentsMobile,
  ProfileMobile,
} from '@/pages'
import RoleRoute from '../RoleRoute/RoleRoute'

export const MobileRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/mobile/dashboard" replace />,
  },
  {
    path: 'dashboard',
    element: <DashboardMobile />,
  },
  {
    path: 'personnel',
    element: <RoleRoute allowedRoles={['director', 'manager']} children={<PersonnelMobile />} />,
  },
  {
    path: 'assignments',
    element: <AssignmentsMobile />,
  },
  {
    path: 'documents',
    element: <DocumentsMobile />,
  },
  {
    path: 'profile',
    element: <ProfileMobile />,
  },
]
