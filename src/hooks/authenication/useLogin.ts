import SonnerToaster from '@/components/ui/toaster'
import { POST } from '@/core/api'
import type { LoginFormData, LoginResponse } from '@/types/Auth'
import { setTokenAuth } from '@/utils/auth'
import { handleCommonError } from '@/utils/handleErrors'
import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
export const useLogin = () => {
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await POST('/api/auth/login', data)
      return response as AxiosResponse<LoginResponse>
    },
    onSuccess: (data) => {
      console.log('data', data)
      setTokenAuth(data.data.token as unknown as string)
      SonnerToaster({
        type: 'success',
        message: 'Đăng nhập thành công',
      })
    },
    onError: (error) => {
      console.log('error', error)
      handleCommonError(error)
    },
  })

  return { loginMutation }
}
