import { useMemo } from 'react'
import { useAuthStore } from '@/stores'
import { ROLE } from '@/constants'
const useCheckRole = () => {
  const { user } = useAuthStore()
  const roles = user?.roles ?? []

  const { isManagerPermission, isDirectorPermission } = useMemo(() => {
    const isDirector = roles.includes(ROLE.DIRECTOR)
    return {
      isManagerPermission: isDirector || roles.includes(ROLE.MANAGER),
      isDirectorPermission: isDirector,
    }
  }, [roles])

  return { isManagerPermission, isDirectorPermission }
}

export default useCheckRole
