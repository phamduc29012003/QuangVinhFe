import './App.css'
import { RouterProvider } from 'react-router'
import router from './routers'
import ResponsiveLayout from './layouts/ResponsiveLayout'

function App() {
  return (
    <ResponsiveLayout>
      <RouterProvider router={router} />
    </ResponsiveLayout>
  )
}

export default App
