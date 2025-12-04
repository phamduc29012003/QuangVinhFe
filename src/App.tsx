import './App.css'
import { RouterProvider } from 'react-router'
import router from './routers'
import { useEffect } from 'react'
import { initOneSignal } from '@/service/onesignal/onesignalService.ts'
import CustomNotifyButton from '@/ButtonTestNoti.tsx'
import { isMobile } from 'react-device-detect'

function App() {
  useEffect(() => {
    initOneSignal()
  }, [])
  return (
    <>
      <RouterProvider router={router} />
      {isMobile && <CustomNotifyButton />}
    </>
  )
}

export default App
