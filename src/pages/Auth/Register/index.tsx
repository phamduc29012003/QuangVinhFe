import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerSchema } from '@/schemas/Auth'
import { useNavigate } from 'react-router'
import SonnerToaster from '@/components/ui/toaster'
import { useRegister } from '@/hooks/authenication/useRegister'

type RegisterFormData = z.infer<typeof registerSchema>

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })
  const { registerMutation } = useRegister()

  const onSubmit = async (data: RegisterFormData) => {
    // call login mutation
    if (errors.confirmPassword === undefined) {
      registerMutation.mutate(data)
      SonnerToaster({
        type: 'success',
        message: 'Đăng ký thành công',
        description: 'Have a nice day nigga!',
      })
      navigate('/login')
    } else {
      // login failed
      SonnerToaster({
        type: 'error',
        message: 'Đăng nhập thất bại',
        description: 'Tên đăng nhập hoặc mật khẩu không chính xác',
      })
    }
  }

  // const handleRegister = async (formData: TRegisterFormSchema) => {
  //   setErrorMessage('');
  //   registerMutation.mutate(formData, {
  //     onSuccess: (response: AxiosResponse<TRegisterResponse>) => {
  //       console.log(response.data);
  //       const data = response.data;
  //       localStorage.setItem('token', data.token);
  //       navigate('/dashboard');
  //     },
  //     onError: (error: any) => {
  //       if (error?.status === 404) {
  //         setErrorMessage(
  //           'Tên đăng nhập hoặc mật khẩu không chính xác',
  //         );
  //         return;
  //       }
  //       setErrorMessage(FORM_COMMON_MESSAGE.API_ERROR);
  //     },
  //   });
  // };

  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="  rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Đăng ký tài khoản</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                {...register('username')}
                type="text"
                placeholder="Tên đăng nhập"
                className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu"
                className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>

        {/* Sign in link */}
        <div className="mt-6 text-center">
          <span className="text-gray-600 text-sm">Đã có tài khoản? </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
