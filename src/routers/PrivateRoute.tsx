// import { Navigate } from 'react-router'
// import { isAuthenticated } from '@/utils/auth'

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  // if (!isAuthenticated()) {
  //   return <Navigate to="/login" replace />
  // }

  return <>{children}</>
}
