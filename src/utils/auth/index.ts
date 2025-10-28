export const getAuthorization = () => {
  const token = getTokenAuth()
  return token ? `Bearer ${token}` : undefined
}

export const login = (token: string) => {
  localStorage.setItem('token', token)
}

export const logout = () => {
  localStorage.removeItem('token')
}

export const getTokenAuth = () => {
  return localStorage.getItem('token')
}

export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  return !!token
}
