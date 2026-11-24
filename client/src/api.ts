const TOKEN_KEY = 'fintrack:token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  status: number
  errors: string[]

  constructor(status: number, errors: string[]) {
    super(errors[0] ?? 'Request failed')
    this.status = status
    this.errors = errors
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = tokenStore.get()
  const hasBody = options.body !== undefined

  const response = await fetch(`/api${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: hasBody ? JSON.stringify(options.body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && token) {
      tokenStore.clear()
      window.dispatchEvent(new Event('fintrack:unauthorized'))
    }
    throw new ApiError(response.status, data?.errors ?? ['Request failed'])
  }

  return data as T
}