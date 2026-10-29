export type ApiUser = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type ApiUrl = {
  id: string
  shortCode: string
  originalUrl: string
  userId: string | null
  clicks: number
  createdAt: string
  shortUrl: string
}

export type ApiIssue = {
  path?: Array<string | number>
  message?: string
}

type ApiErrorBody = {
  error?: string
  issues?: ApiIssue[]
}

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/$/,
    ""
  ) ?? ""

export class ApiError extends Error {
  status: number
  issues?: ApiIssue[]

  constructor(message: string, status: number, issues?: ApiIssue[]) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.issues = issues
  }
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return "Something went wrong"
}

function parseBody(text: string): ApiErrorBody | unknown {
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      ...init,
      headers,
    })
  } catch {
    throw new ApiError(
      "Can't reach the server. Make sure it is running on port 3000.",
      0
    )
  }

  const body = parseBody(await response.text())

  if (!response.ok) {
    const payload =
      body && typeof body === "object" ? (body as ApiErrorBody) : null
    const issue = payload?.issues?.[0]
    throw new ApiError(
      issue?.message ?? payload?.error ?? `Request failed (${response.status})`,
      response.status,
      payload?.issues
    )
  }

  return body as T
}

export const api = {
  register(input: { name: string; email: string; password: string }) {
    return request<{ user: ApiUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    })
  },

  login(input: { email: string; password: string }) {
    return request<{ user: ApiUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    })
  },

  logout() {
    return request<void>("/api/auth/logout", { method: "POST" })
  },

  me() {
    return request<{ user: ApiUser }>("/api/auth/me")
  },

  listUrls() {
    return request<{ urls: ApiUrl[] }>("/api/urls")
  },

  createUrl(url: string) {
    return request<ApiUrl>("/api/urls", {
      method: "POST",
      body: JSON.stringify({ url }),
    })
  },

  deleteUrl(id: string) {
    return request<void>(`/api/urls/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
  },
}
