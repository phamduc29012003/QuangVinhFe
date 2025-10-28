import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import type { AuthStore, LoginResponse, RegisterResponse, ApiError } from '@/types'
import { setTokenAuth as authLogin, logout as authLogout } from '../utils/auth'
import { POST } from '../core/api'

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null })

          try {
            const response = (await POST('/auth/login', { email, password })) as LoginResponse
            const { user, token } = response

            authLogin(token)

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } catch (error: unknown) {
            const apiError = error as ApiError
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: apiError.message || 'Login failed',
            })
          }
        },

        register: async (email: string, password: string, name: string) => {
          set({ isLoading: true, error: null })

          try {
            const response = (await POST('/auth/register', {
              email,
              password,
              name,
            })) as RegisterResponse
            const { user, token } = response

            // Store token in localStorage
            authLogin(token)

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } catch (error: unknown) {
            const apiError = error as ApiError
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: apiError.message || 'Registration failed',
            })
          }
        },

        logout: () => {
          authLogout()
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        },

        clearError: () => {
          set({ error: null })
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading })
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)
