import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { api, type ApiUser } from "@/lib/api"

type AuthContextValue = {
  user: ApiUser | null
  loading: boolean
  login: (input: { email: string; password: string }) => Promise<ApiUser>
  register: (input: {
    name: string
    email: string
    password: string
  }) => Promise<ApiUser>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const SESSION_HINT = "knot:session"

function clearSessionHint() {
  try {
    window.localStorage.removeItem(SESSION_HINT)
  } catch {
    // Storage can be unavailable in private modes; the cookie still works.
  }
}

function setSessionHint() {
  try {
    window.localStorage.setItem(SESSION_HINT, "1")
  } catch {
    // Storage can be unavailable in private modes; the cookie still works.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { user: nextUser } = await api.me()
      setUser(nextUser)
      setSessionHint()
    } catch {
      setUser(null)
      clearSessionHint()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const isAuthPage =
      window.location.pathname === "/login" ||
      window.location.pathname === "/signup"
    let hasHint = false
    try {
      hasHint = window.localStorage.getItem(SESSION_HINT) === "1"
    } catch {
      hasHint = false
    }

    if (isAuthPage && !hasHint) {
      setLoading(false)
      return
    }

    void refresh()
  }, [refresh])

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      const { user: nextUser } = await api.login(input)
      setUser(nextUser)
      setLoading(false)
      setSessionHint()
      return nextUser
    },
    []
  )

  const register = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      const { user: nextUser } = await api.register(input)
      setUser(nextUser)
      setLoading(false)
      setSessionHint()
      return nextUser
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      setUser(null)
      clearSessionHint()
    }
  }, [])

  return (
    <AuthContext
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider")
  }
  return context
}
