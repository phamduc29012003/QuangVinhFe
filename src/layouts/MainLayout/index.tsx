import { Outlet } from 'react-router'
import { isMobile } from 'react-device-detect'
import { FiActivity } from 'react-icons/fi'
import WebLayout from '../WebLayout'
import MobileLayout from '../MobileLayout'

const MainLayout = () => {
  const Layout = isMobile ? MobileLayout : WebLayout

  return (
    <div>
      <Layout />
      <Outlet />
    </div>
  )
}

export default MainLayout
