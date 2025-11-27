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
      return data.data.taskGroups
    },
  })
  return { projectsAssignments: data, isFetching }
}
