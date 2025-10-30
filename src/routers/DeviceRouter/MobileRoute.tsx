import { type RouteObject, Navigate } from 'react-router'
import { DashboardMobile, PersonnelMobile, DocumentsMobile } from '@/pages'
import RoleRoute from '../RoleRoute/RoleRoute'
import ProjectAssignment from '@/pages/Assignments/ProjectAssignment/Web'

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
    path: 'assignments',
    element: <ProjectAssignment />,
  },
  {
    path: 'personnel',
    element: <RoleRoute allowedRoles={['director', 'manager']} children={<PersonnelMobile />} />,
  },
  {
    path: 'documents',
    element: <DocumentsMobile />,
  },
]
