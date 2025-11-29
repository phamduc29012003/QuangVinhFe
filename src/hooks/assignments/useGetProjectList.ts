import { projectsAssignmentsKey } from '@/constants/assignments/assignment'
import { POST } from '@/core/api'
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINT } from '@/common'
import type { getProjectListParams } from '@/types/project'

export const useGetProjectList = (payload: getProjectListParams) => {
  const { data, isFetching } = useQuery({
    queryKey: [projectsAssignmentsKey.getAll, payload],
    queryFn: async () => {
      const response = await POST(API_ENDPOINT.GET_PROJECTS, payload)
      return response
    },
    select(data) {
      return {
        taskGroups: data.taskGroups || [],

        total: data.total || 0,
        totalPages: data.totalPages || 0,
      }
    },
  })
  return {
    projectsAssignments: data?.taskGroups || [],
    total: data?.total || 14,
    totalPages: data?.totalPages || 0,
    isFetching,
  }
}
