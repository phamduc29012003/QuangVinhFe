import SonnerToaster from '@/components/ui/toaster'
import { POST } from '@/core/api'
import type { LoginFormData, LoginResponse } from '@/types/Auth'
import { setTokenAuth } from '@/utils/auth'
import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores'
import { API_ENDPOINT } from '@/common'
export const useLogin = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await POST(API_ENDPOINT.LOGIN, data)
      return response as AxiosResponse<LoginResponse>
    },
    onSuccess: (data) => {
      const { user, token } = data.data

      setTokenAuth(token as unknown as string)
      SonnerToaster({
        type: 'success',
        message: 'Đăng nhập thành công',
      })
      setAuth(user, token)
      navigate('/dashboard')
    },
  })

  return { loginMutation }
}
