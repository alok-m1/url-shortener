import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { api, getApiErrorMessage, type ApiUrl } from "@/lib/api"

type DashboardDataContextValue = {
  urls: ApiUrl[]
  loading: boolean
  error: string | null
  refresh: (options?: { silent?: boolean }) => Promise<void>
  createUrl: (url: string) => Promise<ApiUrl>
  deleteUrl: (id: string) => Promise<void>
}

const DashboardDataContext = createContext<DashboardDataContextValue | null>(
  null
)

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [urls, setUrls] = useState<ApiUrl[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (options: { silent?: boolean } = {}) => {
    if (!options.silent) setLoading(true)
    setError(null)
    try {
      const { urls: nextUrls } = await api.listUrls()
      setUrls(nextUrls)
    } catch (caught) {
      setError(getApiErrorMessage(caught))
    } finally {
      if (!options.silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    function onFocus() {
      if (document.visibilityState === "visible") {
        void refresh({ silent: true })
      }
    }
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [refresh])

  const createUrl = useCallback(async (url: string) => {
    const created = await api.createUrl(url)
    setUrls((current) => [created, ...current])
    return created
  }, [])

  const deleteUrl = useCallback(async (id: string) => {
    await api.deleteUrl(id)
    setUrls((current) => current.filter((url) => url.id !== id))
  }, [])

  return (
    <DashboardDataContext
      value={{
        urls,
        loading,
        error,
        refresh,
        createUrl,
        deleteUrl,
      }}
    >
      {children}
    </DashboardDataContext>
  )
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext)
  if (!context) {
    throw new Error(
      "useDashboardData must be used inside a DashboardDataProvider"
    )
  }
  return context
}
