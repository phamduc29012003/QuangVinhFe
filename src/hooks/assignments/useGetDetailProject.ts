import { API_ENDPOINT } from '@/common/apiEndpoint'
import { POST } from '@/core/api'
import { useQuery } from '@tanstack/react-query'
import { projectAssignmentDetailKey } from '@/constants'

export const useGetDetailProject = (id: number) => {
  const { data, isFetching, error } = useQuery({
    queryKey: [projectAssignmentDetailKey.detail(id.toString()), { taskGroupId: id }],
    queryFn: () => POST(API_ENDPOINT.GET_PROJECT_DETAIL, { taskGroupId: Number(id) }),
    select(data) {
      return data.taskGroup
    },
  })
  return { projectAssignmentDetail: data, isFetching, error }
}
