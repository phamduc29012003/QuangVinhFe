import { POST } from '@/core/api'
import { useMutation } from '@tanstack/react-query'
import { handleCommonError } from '@/utils/handleErrors'
import SonnerToaster from '@/components/ui/toaster'
import type { IProject } from '@/types/project'
import { API_ENDPOINT } from '@/common'

export const useCreateProject = () => {
  const createProjectMutation = useMutation({
    mutationFn: async (payload: IProject) => {
      const response = await POST(API_ENDPOINT.CREATE_PROJECT, payload)
      return response
    },
    onSuccess: (respones) => {
      SonnerToaster({
        type: 'success',
        message: 'Project created successfully',
        description: respones.message,
      })
    },
    onError: (error) => {
      handleCommonError(error)
    },
  })

  return { createProjectMutation }
}
