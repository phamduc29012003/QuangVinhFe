import { POST } from '@/core/api'
import { useMutation } from '@tanstack/react-query'
import SonnerToaster from '@/components/ui/toaster'
import { API_ENDPOINT } from '@/common'
import { queryClient } from '@/lib/queryClient'
import { detailTaskKey } from '@/constants'

export interface updateTaskPayload {
  taskId: number
  checklist: string
}

export const useUpdateDescription = () => {
  const updateTaskMutation = useMutation({
    mutationFn: async (payload: updateTaskPayload) => {
      console.log('📤 Sending payload to API:', payload)
      const response = await POST(API_ENDPOINT.UPDATE_CHECKLIST, payload)
      console.log('✅ API Response:', response)
      return response
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: [detailTaskKey.detail(variables.taskId.toString()), { taskId: variables.taskId }],
      })
      SonnerToaster({
        type: 'success',
        message: 'Cập nhật công việc thành công',
        description: response.message,
      })
    },
  })
  return updateTaskMutation
}
