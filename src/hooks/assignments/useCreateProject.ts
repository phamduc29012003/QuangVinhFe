import { POST } from '@/core/api'
import { useMutation } from '@tanstack/react-query'
import type { IProjectAssignment } from '@/types/Assignment'
import { handleCommonError } from '@/utils/handleErrors'
import SonnerToaster from '@/components/ui/toaster'

export const useCreateProject = () => {
  const createProjectMutation = useMutation({
    mutationFn: async (payload: IProjectAssignment) => {
      const response = await POST('/projects-assignments', payload)
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

// how to use
// const createProjectMutation = useCreateProject();
//
//   createProjectMutation.mutate(payload, {
//     onSuccess: () => {
// queryClient.invalidateQueries({ queryKey: projectsAssignmentsKey.getAll });
//    add logic here
//     },
//   });
// };
