import { handleCommonError } from '@/utils/handleErrors'
import { projectsAssignmentsKey } from '@/constants/assignments/assignment'
import { GET } from '@/core/api'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useGetProjectList = () => {
  const { data, isLoading, error, status } = useQuery({
    queryKey: projectsAssignmentsKey.getAll,
    queryFn: async () => {
      const response = await GET('/projects-assignments')
      return response
    },
    select: (data) => data.data,
    enabled: true,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    retry: true,
  })
  // handle error luôn ở đây không cần phải return cả error và gọi useEffect ở component gọi
  useEffect(() => {
    if (status === 'error' || error) {
      handleCommonError(error)
    }
  }, [status, error])

  return { projectsAssignments: data, isLoading }
}
