// User roles
export type UserRole = 'director' | 'manager' | 'user'

// User-related types
export interface User {
  id: string
  email: string
  name: string
  role?: UserRole
  avatar?: string
  createdAt: string
  updatedAt: string
}

// User API response types
export interface UserResponse {
  id: string
  email: string
  name: string
  role?: UserRole
  avatar?: string
  createdAt: string
  updatedAt: string
}
