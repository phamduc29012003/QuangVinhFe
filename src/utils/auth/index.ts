import { queryClient } from '@/lib/queryClient'

export const getAuthorization = () => {
  const token = getTokenAuth()
  return token ? `Bearer ${token}` : undefined
}

export const setTokenAuth = (token: string) => {
  localStorage.setItem('token', token)
}

export const logout = () => {
  localStorage.removeItem('token')
  queryClient.clear()
}

export const getTokenAuth = () => {
  return localStorage.getItem('token')
}

export const isAuthenticated = () => {
  const token = getTokenAuth()
  return !!token
}

/**
 * Get userId from JWT token
 * Note: This is a simple implementation. In production, use proper JWT decode library
 */
export const getUserId = (): string | null => {
  const token = getTokenAuth()
  if (!token) return null

  try {
    // JWT format: header.payload.signature
    const payload = token.split('.')[1]
    if (!payload) return null

    // Decode base64
    const decoded = JSON.parse(atob(payload))
    return decoded.userId || decoded.sub || decoded.id || null
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}
