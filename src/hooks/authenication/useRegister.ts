import SonnerToaster from '@/components/ui/toaster'
import { POST } from '@/core/api'
import type { RegisterResponse } from '@/types/Auth'
import { handleCommonError } from '@/utils/handleErrors'
import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

export const useRegister = () => {
  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await POST('/api/auth/register', data)
      return response as AxiosResponse<RegisterResponse>
    },
    onSuccess: () => {
      SonnerToaster({
        type: 'success',
        message: 'Đăng ký thành công',
      })
    },
    onError: (error) => {
      console.log('error', error)
      handleCommonError(error)
    },
  })

  return { registerMutation }
}
