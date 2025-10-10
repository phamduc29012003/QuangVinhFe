import { Outlet } from 'react-router'
import { FiActivity } from 'react-icons/fi'

const MainLayout = () => {
  return (
    <div>
      MainLayout
      <FiActivity></FiActivity>
      <Outlet />
    </div>
  )
}

export default MainLayout
