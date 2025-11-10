import './App.css'
import { RouterProvider } from 'react-router'
import router from './routers'
import { useEffect } from 'react'
import { initOneSignal } from '@/service/onesignal/onesignalService.ts'
import CustomNotifyButton from '@/ButtonTestNoti.tsx'

function App() {
  useEffect(() => {
    initOneSignal()
  }, [])
  return (
    <>
      <RouterProvider router={router} />
      <CustomNotifyButton />
    </>
  )
}

export default App
