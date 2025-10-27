import { POST } from '@/core/api'
import { useMutation } from '@tanstack/react-query'

export const useRegister = () => {
  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      return POST('/auth/register', data)
    },
  })

  return { registerMutation }
}
