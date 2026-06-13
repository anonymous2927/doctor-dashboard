import { ApiResponse } from '@/types'

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(data.error || 'Something went wrong', response.status)
    }

    return { success: true, data }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

export const api = {
  get: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, body: unknown, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(url: string, body: unknown, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(url: string, body: unknown, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: 'DELETE' }),
}
