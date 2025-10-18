import { Outlet } from 'react-router'
import { isMobile } from 'react-device-detect'
import WebLayout from '../WebLayout'
import MobileLayout from '../MobileLayout'
import { useIsMobile } from '@/hooks/use-mobile'

const MainLayout = () => {
  const isMobileDevice = useIsMobile()
  const Layout = isMobileDevice || isMobile ? MobileLayout : WebLayout

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default MainLayout
