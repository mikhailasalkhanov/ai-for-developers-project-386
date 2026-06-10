import type { ApiError } from './types'

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:4010'

class ApiRequestError extends Error {
  code: number
  constructor(error: ApiError) {
    super(error.message)
    this.name = 'ApiRequestError'
    this.code = error.code
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  if (body !== undefined) {
    options.body = JSON.stringify(body)
  }
  const response = await fetch(`${BASE_URL}${path}`, options)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T
  }
  const data = await response.json()
  if (!response.ok) {
    throw new ApiRequestError(data as ApiError)
  }
  return data as T
}

export function get<T>(path: string): Promise<T> {
  return request<T>('GET', path)
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>('POST', path, body)
}

export function patch<T>(path: string, body: unknown): Promise<T> {
  return request<T>('PATCH', path, body)
}

export function put<T>(path: string, body: unknown): Promise<T> {
  return request<T>('PUT', path, body)
}

export function del<T>(path: string): Promise<T> {
  return request<T>('DELETE', path)
}
