// services/api.ts
import { getAuthorization } from '@/utils/auth'
import axios, { type AxiosRequestConfig } from 'axios'

// Flag để tránh check lỗi 401 khi login
let isLoginRequest = false

// Trong development: baseURL = '' để dùng vite proxy
// Trong production: baseURL từ env hoặc default backend URL

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30000,
})

// Attach JWT to every request if exists
api.interceptors.request.use(
  (config) => {
    const token = getAuthorization()

    // Thêm token nếu có
    if (token) {
      config.headers.Authorization = token
    }

    return config
  },
  (error) => Promise.reject(error)
)
// Global error handling without refresh-token logic
api.interceptors.response.use(
  (response) => {
    isLoginRequest = false
    return response
  },
  (error) => {
    const status = error.response?.status

    if (status === 401 && !isLoginRequest) {
      // Sonner Toaster
    }

    isLoginRequest = false
    return Promise.reject(error)
  }
)

interface RequestConfig extends AxiosRequestConfig {
  rawResponse?: boolean
}

export const GET = async (
  url: string,
  params?: Record<string, unknown>,
  config: RequestConfig = {}
) => {
  const queryString = params
    ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
    : ''
  const urlWithQuery = `${url}${queryString}`
  try {
    const res = await api.get(urlWithQuery, config)
    return config.rawResponse ? res : res.data
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const POST = async (url: string, params: any, config: RequestConfig = {}) => {
  try {
    const res = await api.post(url, params, config)
    return config.rawResponse ? res : res.data
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const PUT = async (url: string, params: any, config: RequestConfig = {}) => {
  try {
    const res = await api.put(url, params, config)
    return config.rawResponse ? res : res.data
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const DELETE = async (url: string, config: RequestConfig = {}) => {
  try {
    const res = await api.delete(url, config)
    return config.rawResponse ? res : res.data
  } catch (e) {
    console.error(e)
    throw e
  }
}

// 67:3  error  Unnecessary try/catch wrapper  no-useless-catch
// 76:3  error  Unnecessary try/catch wrapper  no-useless-catch
// 85:3  error  Unnecessary try/catch wrapper  no-useless-catch
// 94:3  error  Unnecessary try/catch wrapper  no-useless-catch
