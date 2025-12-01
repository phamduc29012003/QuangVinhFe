import { POST } from '@/core/api'
import { useMutation } from '@tanstack/react-query'
import SonnerToaster from '@/components/ui/toaster'
import { API_ENDPOINT } from '@/common'
import { queryClient } from '@/lib/queryClient'

export interface CreateTaskPayload {
  task: {
    description: string
    priority: number
    taskType: number
    groupId: number
    estimateTime: number
    imageUrls?: string[]
    checkList?: string
    assignee?: {
      id: number
      name: string
    }
    status?: number
    startTime?: number
  }
}

export const useCreateTask = () => {
  const createTaskMutation = useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      const response = await POST(API_ENDPOINT.CREATE_TASK, payload)
      return response
    },
    onSuccess: (response) => {
      // Invalidate all project detail queries (regardless of specific ID)
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey as any[]
          return queryKey[0]?.toString().includes('projectAssignmentDetail')
        },
      })
      SonnerToaster({
        type: 'success',
        message: 'Tạo công việc thành công',
        description: response.message,
      })
    },
  })
  return createTaskMutation
}
