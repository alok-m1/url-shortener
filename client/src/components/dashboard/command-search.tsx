import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  BarChart3Icon,
  CornerDownLeftIcon,
  LayoutDashboardIcon,
  Link2Icon,
  QrCodeIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDashboardData } from "@/components/dashboard/dashboard-data"
import { splitShortUrl } from "@/lib/format"
import { cn } from "cn"

const pages = [
  { title: "Overview", to: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Links", to: "/dashboard/links", icon: Link2Icon },
  { title: "Analytics", to: "/dashboard/analytics", icon: BarChart3Icon },
  { title: "QR codes", to: "/dashboard/qr-codes", icon: QrCodeIcon },
  { title: "Settings", to: "/dashboard/settings", icon: SettingsIcon },
]

export function CommandSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const { urls } = useDashboardData()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const normalized = query.trim().toLowerCase()
  const filteredLinks = useMemo(() => {
    if (!normalized) return urls.slice(0, 4)
    return urls
      .filter((link) => {
        const short = splitShortUrl(link.shortUrl, link.shortCode).display
        return (
          link.shortCode.toLowerCase().includes(normalized) ||
          link.originalUrl.toLowerCase().includes(normalized) ||
          short.toLowerCase().includes(normalized)
        )
      })
      .slice(0, 5)
  }, [normalized, urls])

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(normalized)
  )

  function go(to: string) {
    setOpen(false)
    setQuery("")
    navigate({ to })
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setQuery("")
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group flex h-8 items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-xs text-muted-foreground transition-colors hover:border-ring/60 hover:text-foreground dark:bg-input/30",
          className
        )}
        aria-label="Search links and pages"
      >
        <SearchIcon className="size-3.5" />
        <span className="hidden sm:inline">Search links…</span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-border bg-muted px-1 font-mono text-[9px] sm:flex">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="gap-0 overflow-hidden p-0 sm:max-w-lg"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogDescription className="sr-only">
            Search links, analytics, and settings
          </DialogDescription>

          <div className="flex items-center gap-2 border-b border-border px-3.5">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search links, pages, tags…"
              autoFocus
              className="h-12 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
              ESC
            </kbd>
          </div>

          <div className="max-h-[26rem] overflow-y-auto p-2">
            {filteredLinks.length > 0 && (
              <div>
                <p className="px-2 pt-1.5 pb-1 font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
                  Links
                </p>
                {filteredLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => go("/dashboard/links")}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-brand/20 text-brand-foreground dark:bg-brand/10 dark:text-brand">
                      <Link2Icon className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-xs">
                        {splitShortUrl(link.shortUrl, link.shortCode).display}
                      </span>
                      <span className="block truncate text-[10px] text-muted-foreground">
                        {link.originalUrl}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {link.clicks.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {filteredPages.length > 0 && (
              <div className="mt-1">
                <p className="px-2 pt-1.5 pb-1 font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
                  Pages
                </p>
                {filteredPages.map((page) => {
                  const Icon = page.icon
                  return (
                    <button
                      key={page.to}
                      type="button"
                      onClick={() => go(page.to)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-muted"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-md border border-border bg-card text-muted-foreground">
                        <Icon className="size-3.5" />
                      </span>
                      {page.title}
                      <CornerDownLeftIcon className="ml-auto size-3 text-muted-foreground/40" />
                    </button>
                  )
                })}
              </div>
            )}

            {filteredLinks.length === 0 && filteredPages.length === 0 && (
              <div className="px-2 py-10 text-center">
                <p className="text-sm font-medium">No results for “{query}”</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try a slug, destination, or page name.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border bg-muted/40 px-3.5 py-2 font-mono text-[9px] text-muted-foreground">
            <span>Search across your workspace</span>
            <span className="flex items-center gap-1">
              <span className="rounded border border-border bg-card px-1">
                ↵
              </span>
              to open
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
