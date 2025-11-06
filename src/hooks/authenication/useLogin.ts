import SonnerToaster from '@/components/ui/toaster'
import { POST } from '@/core/api'
import type { LoginFormData, LoginResponse } from '@/types/Auth'
import { setTokenAuth } from '@/utils/auth'
import { handleCommonError } from '@/utils/handleErrors'
import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores'
export const useLogin = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await POST('/api/auth/login', data)
      return response as AxiosResponse<LoginResponse>
    },
    onSuccess: (data) => {
      const { user, token } = data.data
      console.log(data)

      setTokenAuth(token as unknown as string)
      SonnerToaster({
        type: 'success',
        message: 'Đăng nhập thành công',
      })
      setAuth(user, token)
      navigate('/dashboard')
    },
    onError: (error) => {
      console.log('error', error)
      handleCommonError(error)
    },
  })

  return { loginMutation }
}
