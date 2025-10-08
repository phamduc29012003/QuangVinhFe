// hooks/useSocket.ts
'use client'
import { useEffect, useRef } from 'react'
import { io, Socket, type ManagerOptions, type SocketOptions } from 'socket.io-client'

export function useSocket(url: string, options?: Partial<ManagerOptions & SocketOptions>) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io(url, options)
    socketRef.current = socket

    socket.on('connect', () => console.log('✅ Connected:', socket.id))
    socket.on('disconnect', () => console.log('❌ Disconnected'))

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [url, options])

  return socketRef
}
