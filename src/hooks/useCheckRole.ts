import { useMemo } from 'react'
import { useAuthStore } from '@/stores'

const useCheckRole = () => {
  const { user } = useAuthStore()
  const roles = user?.roles ?? []

  const { isManagerPermission, isDirectorPermission } = useMemo(() => {
    const isDirector = roles.includes('DIRECTOR')
    return {
      isManagerPermission: isDirector || roles.includes('MANAGER'),
      isDirectorPermission: isDirector,
    }
  }, [roles])

  return { isManagerPermission, isDirectorPermission }
}

export default useCheckRole
