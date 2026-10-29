import { useMemo, useState } from "react"
import {
  ArrowDownUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  Link2Icon,
  SearchIcon,
} from "lucide-react"
import { toast } from "sonner"
import { CreateLinkDialog } from "@/components/dashboard/create-link-dialog"
import { useDashboardData } from "@/components/dashboard/dashboard-data"
import { LinkActions } from "@/components/dashboard/link-actions"
import { LinkAvatar } from "@/components/dashboard/link-avatar"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { downloadLinksCsv } from "@/lib/csv"
import {
  formatDate,
  formatNumber,
  formatRelative,
  hashString,
  splitShortUrl,
} from "@/lib/format"
import { cn } from "cn"

type Filter = "all" | "week" | "older"
type Sort = "newest" | "clicks" | "name"

const sortLabels: Record<Sort, string> = {
  newest: "Newest first",
  clicks: "Most clicks",
  name: "Short code A–Z",
}

export function LinksPage() {
  const { urls, loading, error, refresh } = useDashboardData()
  const [filter, setFilter] = useState<Filter>("all")
  const [sort, setSort] = useState<Sort>("newest")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 5

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  const counts = useMemo(
    () => ({
      all: urls.length,
      week: urls.filter((url) => new Date(url.createdAt).getTime() >= weekAgo)
        .length,
      older: urls.filter((url) => new Date(url.createdAt).getTime() < weekAgo)
        .length,
    }),
    [urls, weekAgo]
  )

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const result = urls.filter((url) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "week" && new Date(url.createdAt).getTime() >= weekAgo) ||
        (filter === "older" && new Date(url.createdAt).getTime() < weekAgo)

      const short = splitShortUrl(url.shortUrl, url.shortCode)
      const matchesQuery =
        !normalized ||
        url.shortCode.toLowerCase().includes(normalized) ||
        url.originalUrl.toLowerCase().includes(normalized) ||
        short.display.toLowerCase().includes(normalized) ||
        url.shortUrl.toLowerCase().includes(normalized)

      return matchesFilter && matchesQuery
    })

    return [...result].sort((a, b) => {
      if (sort === "clicks") return b.clicks - a.clicks
      if (sort === "name") return a.shortCode.localeCompare(b.shortCode)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [filter, query, sort, urls, weekAgo])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const visible = filtered.slice(start, start + pageSize)
  const filteredClicks = filtered.reduce((sum, url) => sum + url.clicks, 0)

  function resetFilters() {
    setQuery("")
    setFilter("all")
    setPage(1)
  }

  function exportLinks() {
    if (filtered.length === 0) return
    downloadLinksCsv(filtered)
    toast.success("CSV exported", {
      description: `${filtered.length} link${filtered.length === 1 ? "" : "s"} downloaded.`,
    })
  }

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title={
          <>
            Links
            <span className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[10px] font-normal tracking-normal text-muted-foreground">
              {urls.length}
            </span>
          </>
        }
        description="Every knot in your workspace, in one tidy place."
      >
        <Button
          variant="outline"
          className="h-9 gap-1.5 rounded-xl"
          onClick={exportLinks}
          disabled={filtered.length === 0}
        >
          <DownloadIcon className="size-3.5" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <CreateLinkDialog />
      </PageHeader>

      <Card className="gap-0 overflow-visible py-0">
        <div className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search by code or destination…"
              className="h-9 rounded-lg pl-8 text-xs"
              aria-label="Search links"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tabs
              value={filter}
              onValueChange={(value) => {
                setFilter(value as Filter)
                setPage(1)
              }}
            >
              <TabsList className="h-8">
                <TabsTrigger value="all" className="gap-1.5 px-2.5 text-[11px]">
                  All
                  <span className="font-mono text-[9px] opacity-60">
                    {counts.all}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  className="gap-1.5 px-2.5 text-[11px]"
                >
                  This week
                  <span className="font-mono text-[9px] opacity-60">
                    {counts.week}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="older"
                  className="gap-1.5 px-2.5 text-[11px]"
                >
                  Older
                  <span className="font-mono text-[9px] opacity-60">
                    {counts.older}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="h-8 gap-1.5 rounded-lg px-2.5 text-[11px]"
                  />
                }
              >
                <ArrowDownUpIcon className="size-3.5" />
                {sortLabels[sort]}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value as Sort)
                    setPage(1)
                  }}
                >
                  {(Object.keys(sortLabels) as Sort[]).map((key) => (
                    <DropdownMenuRadioItem key={key} value={key}>
                      {sortLabels[key]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading ? (
          <div className="border-t border-border/70 p-4">
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-14 rounded-lg" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="border-t border-border/70 px-4 py-14 text-center">
            <p className="text-sm font-medium">Could not load your links</p>
            <p className="mt-1 text-xs text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 h-8"
              onClick={() => void refresh()}
            >
              Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="border-t border-border/70">
              <Table className="table-fixed sm:table-auto">
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[62%] pl-4 text-[10px] tracking-[0.08em] uppercase sm:w-auto">
                      Link
                    </TableHead>
                    <TableHead className="hidden text-[10px] tracking-[0.08em] uppercase lg:table-cell">
                      Destination
                    </TableHead>
                    <TableHead className="w-20 text-[10px] tracking-[0.08em] uppercase sm:w-auto">
                      Clicks
                    </TableHead>
                    <TableHead className="hidden text-[10px] tracking-[0.08em] uppercase md:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="w-10 pr-4" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((link) => {
                    const short = splitShortUrl(link.shortUrl, link.shortCode)
                    return (
                      <TableRow key={link.id} className="group">
                        <TableCell className="py-2.5 pl-4">
                          <div className="flex items-center gap-2.5">
                            <LinkAvatar
                              seed={hashString(link.shortCode)}
                              slug={link.shortCode}
                            />
                            <div className="min-w-0">
                              <p className="truncate font-mono text-[11px] font-medium">
                                {short.display}
                              </p>
                              <p className="max-w-[18rem] truncate text-[10px] text-muted-foreground lg:hidden">
                                {link.originalUrl}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden max-w-[16rem] truncate text-[11px] text-muted-foreground lg:table-cell">
                          {link.originalUrl}
                        </TableCell>
                        <TableCell className="font-mono text-[11px] tabular-nums">
                          {formatNumber(link.clicks)}
                        </TableCell>
                        <TableCell
                          className="hidden font-mono text-[10px] text-muted-foreground md:table-cell"
                          title={formatDate(link.createdAt)}
                        >
                          {formatRelative(link.createdAt)}
                        </TableCell>
                        <TableCell className="pr-3 text-right">
                          <LinkActions link={link} />
                        </TableCell>
                      </TableRow>
                    )
                  })}

                  {filtered.length === 0 && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="py-16">
                        <div className="flex flex-col items-center text-center">
                          <span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
                            <Link2Icon className="size-4" />
                          </span>
                          <p className="mt-3 text-sm font-medium">
                            {urls.length === 0
                              ? "No links yet"
                              : "No links match those filters"}
                          </p>
                          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                            {urls.length === 0
                              ? "Create your first short link to get started."
                              : "Try a different search, or clear the filters."}
                          </p>
                          {urls.length === 0 ? (
                            <div className="mt-4">
                              <CreateLinkDialog label="Create your first link" />
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4 h-8 gap-1.5"
                              onClick={resetFilters}
                            >
                              <CheckIcon className="size-3.5" />
                              Clear filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-border/70 px-4 py-3 sm:flex-row">
              <p className="font-mono text-[10px] text-muted-foreground">
                Showing {filtered.length === 0 ? 0 : start + 1}–
                {Math.min(start + pageSize, filtered.length)} of{" "}
                {filtered.length} links · {formatNumber(filteredClicks)} clicks
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  <ChevronLeftIcon className="size-3.5" />
                </Button>
                {Array.from({ length: pageCount }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPage(index + 1)}
                    aria-label={`Go to page ${index + 1}`}
                    aria-current={
                      currentPage === index + 1 ? "page" : undefined
                    }
                    className={cn(
                      "grid size-7 place-items-center rounded-md font-mono text-[10px] transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      currentPage === index + 1
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60"
                    )}
                  >
                    {index + 1}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={currentPage === pageCount}
                  aria-label="Next page"
                  onClick={() =>
                    setPage((value) => Math.min(pageCount, value + 1))
                  }
                >
                  <ChevronRightIcon className="size-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  )
}
