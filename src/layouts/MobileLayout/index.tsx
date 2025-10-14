import { type ReactNode } from 'react'
import { useIsMobile } from '@/hooks/use-mobile.ts'

interface MobileLayoutProps {
  children: ReactNode
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const isMobile = useIsMobile()

  if (!isMobile) {
    return null
  }

  return <div>{children}</div>
}

export default MobileLayout
