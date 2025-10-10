/* eslint-disable react-refresh/only-export-components */
'use client'
import { createContext, useContext } from 'react'
import { Socket } from 'socket.io-client'
import { useSocket } from '@/hooks/useSocket'
import { getTokenAuth } from '@/utils/auth'

const SocketContext = createContext<{ socket: Socket | null }>({ socket: null })
//tại sao dùng context thay cho zustand với socket
// socket được lưu trong ref → không gây re-render khi emit/on event.?\\
// Toàn app chỉ cần useSocketContext() để lấy instance, không lo state thay đổi trigger re-render.
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const token = getTokenAuth()
  const socketRef = useSocket('VITE_ENV.PORT_DEMO', {
    auth: { token: token },
  })

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext)
