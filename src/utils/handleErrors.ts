import SonnerToaster from '@/components/ui/toaster'

const handleCommonError = (error?: any) => {
  const errorMessage = error?.message || error?.data?.message || 'Lỗi không xác định'

  SonnerToaster({
    type: 'error',
    message: errorMessage,
    description: error?.message,
  })
}

export { handleCommonError }
