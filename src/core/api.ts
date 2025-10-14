// services/api.ts
import { getTokenAuth } from '@/utils/auth'
import axios, { type AxiosRequestConfig } from 'axios'

// Flag để tránh check lỗi 401 khi login
let isLoginRequest = false

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
})

// Attach JWT to every request if exists
api.interceptors.request.use(
  (config) => {
    const token = getTokenAuth()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.url?.includes('/auth/login')) {
      isLoginRequest = true
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Global error handling without refresh-token logic
api.interceptors.response.use(
  (response) => {
    isLoginRequest = false
    return response.data
  },
  (error) => {
    const status = error.response?.status

    if (status === 401 && !isLoginRequest) {
      //   toast.error("Unauthorized. Please again.");
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
    return e
  }
}

export const POST = async (url: string, params: any, config: RequestConfig = {}) => {
  try {
    const res = await api.post(url, params, config)
    return config.rawResponse ? res : res.data
  } catch (e) {
    return e
  }
}

export const PUT = async (url: string, params: any, config: RequestConfig = {}) => {
  try {
    const res = await api.put(url, params, config)
    return config.rawResponse ? res : res.data
  } catch (e) {
    return e
  }
}

export const DELETE = async (url: string, config: RequestConfig = {}) => {
  try {
    const res = await api.delete(url, config)
    return config.rawResponse ? res : res.data
  } catch (e) {
    return e
  }
}
