export const getAuthorization = () => {
  const token = getTokenAuth()
  return token ? `Bearer ${token}` : undefined
}

export const setTokenAuth = (token: string) => {
  localStorage.setItem('token', token)
}

export const logout = () => {
  localStorage.removeItem('token')
}

export const getTokenAuth = () => {
  return localStorage.getItem('token')
}

export const isAuthenticated = () => {
  const token = getTokenAuth()
  return !!token
}
