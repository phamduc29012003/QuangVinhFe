import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Username là bắt buộc'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
})

export const registerSchema = z
  .object({
    username: z.string().min(1, 'Username là bắt buộc'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu và xác nhận mật khẩu không khớp',
  })
