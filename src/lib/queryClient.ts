// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'
import { handleCommonError } from '@/utils/handleErrors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // không tự refetch khi đổi tab
      retry: 1, // retry 1 lần nếu lỗi
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      onError: (error: unknown) => {
        handleCommonError(error)
      },
    },
  },
})
