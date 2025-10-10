// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // không tự refetch khi đổi tab
      retry: 1, // retry 1 lần nếu lỗi
      staleTime: 1000 * 60 * 5, // cache trong 5 phút
    },
  },
})
