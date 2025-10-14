import { type ReactNode } from 'react'
import { useIsMobile } from '@/hooks/use-mobile.ts'
import WebLayout from '../WebLayout'
import MobileLayout from '../MobileLayout'

interface ResponsiveLayoutProps {
  children: ReactNode
}

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile()

  if (isMobile === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <WebLayout>{children}</WebLayout>
      <MobileLayout>{children}</MobileLayout>
    </>
  )
}

export default ResponsiveLayout
