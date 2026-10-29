import { Link } from "@tanstack/react-router"
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  Link2Icon,
  MousePointerClickIcon,
  RefreshCwIcon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import { ClicksDonut } from "@/components/dashboard/clicks-donut"
import { CreateLinkDialog } from "@/components/dashboard/create-link-dialog"
import { useDashboardData } from "@/components/dashboard/dashboard-data"
import { LinkActions } from "@/components/dashboard/link-actions"
import { LinkAvatar } from "@/components/dashboard/link-avatar"
import {
  buildLinksCreatedRows,
  LinksCreatedArea,
} from "@/components/dashboard/links-created-chart"
import { StatCard } from "@/components/dashboard/stat-card"
import { QrCode } from "@/components/qr-code"
import { Bar } from "@/components/dither-kit/bar"
import { BarChart } from "@/components/dither-kit/bar-chart"
import type { ChartConfig } from "@/components/dither-kit/chart-context"
import { Grid } from "@/components/dither-kit/grid"
import { Tooltip } from "@/components/dither-kit/tooltip"
import { XAxis } from "@/components/dither-kit/x-axis"
import { YAxis } from "@/components/dither-kit/y-axis"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
  formatAxisCount,
  formatDate,
  formatNumber,
  formatRelative,
  getGreeting,
  hashString,
  splitShortUrl,
} from "@/lib/format"
import { cn } from "cn"

const clicksConfig: ChartConfig = {
  clicks: { label: "Clicks", color: "blue" },
}

export function DashboardOverview() {
  const { user } = useAuth()
  const { urls, loading, error, refresh } = useDashboardData()

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0)
  const linksCount = urls.length
  const averageClicks = linksCount ? Math.round(totalClicks / linksCount) : 0
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const createdThisWeek = urls.filter(
    (url) => new Date(url.createdAt).getTime() >= weekAgo
  ).length

  const recentLinks = [...urls]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6)

  const topLinks = [...urls].sort((a, b) => b.clicks - a.clicks).slice(0, 6)
  const topLink = topLinks.at(0)
  const topLinkShare =
    topLink && totalClicks > 0
      ? Math.round((topLink.clicks / totalClicks) * 100)
      : 0

  const chartRows = topLinks.map((url) => ({
    label: url.shortCode.slice(0, 6),
    code: url.shortCode,
    clicks: url.clicks,
  }))

  const clickSpark =
    totalClicks > 0
      ? [...topLinks].reverse().map((url) => url.clicks)
      : undefined
  const createdSpark =
    linksCount > 0
      ? buildLinksCreatedRows(urls, 7).map((row) => row.links)
      : undefined

  const firstName = user?.name.split(/\s+/)[0] ?? "there"
  const dateLine = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date())

  function exportLinks() {
    if (urls.length === 0) return
    downloadLinksCsv(urls)
    toast.success("CSV exported", {
      description: `${urls.length} link${urls.length === 1 ? "" : "s"} downloaded.`,
    })
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] pattern-45 [mask-image:linear-gradient(to_left,black,transparent_92%)] text-foreground/[0.06] sm:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-10 size-64 rounded-full bg-foreground/[0.04] blur-[90px]"
        />

        <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
                </span>
                Live workspace
              </span>
              <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                {dateLine}
              </span>
            </div>

            <h1 className="mt-3 text-[2rem] leading-[1.02] font-semibold tracking-[-0.055em] sm:text-[2.45rem]">
              {getGreeting()},{" "}
              <span className="font-display text-[1.12em] font-normal tracking-[-0.02em] italic">
                {firstName}
              </span>
              <span className="text-brand">.</span>
            </h1>
            <p className="mt-2.5 max-w-lg text-[13px] leading-relaxed text-muted-foreground">
              Here's the honest picture of your links — every click, every cut,
              in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="h-9 gap-1.5 rounded-xl bg-background/60"
              onClick={exportLinks}
              disabled={urls.length === 0}
            >
              <DownloadIcon className="size-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <CreateLinkDialog />
          </div>
        </div>

        <div className="relative flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 bg-muted/20 px-5 py-3 sm:px-6">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <Link2Icon className="size-3" />
            {formatNumber(linksCount)} links
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <MousePointerClickIcon className="size-3" />
            {formatNumber(totalClicks)} clicks
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <CalendarDaysIcon className="size-3" />
            {formatNumber(createdThisWeek)} this week
          </span>
          <span className="ml-auto hidden items-center gap-1 font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase sm:flex">
            <SparklesIcon className="size-3" />
            Every click, counted
          </span>
        </div>
      </section>

      {loading ? (
        <OverviewSkeleton />
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="grid size-10 place-items-center rounded-full bg-destructive/10 text-destructive">
              <RefreshCwIcon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">Could not load your links</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                {error}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => void refresh()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total clicks"
              value={formatNumber(totalClicks)}
              icon={MousePointerClickIcon}
              spark={clickSpark}
              sparkColor="blue"
              detail={
                totalClicks === 0
                  ? "No clicks recorded yet"
                  : `Across ${linksCount} link${linksCount === 1 ? "" : "s"}`
              }
            />
            <StatCard
              label="Links"
              value={formatNumber(linksCount)}
              icon={Link2Icon}
              spark={createdSpark}
              sparkColor="purple"
              detail={
                linksCount === 0
                  ? "Your first link awaits"
                  : "In your workspace"
              }
            />
            <StatCard
              label="Clicks per link"
              value={formatNumber(averageClicks)}
              icon={Link2Icon}
              spark={clickSpark}
              sparkColor="pink"
              detail="Average across every link"
            />
            <StatCard
              label="Created this week"
              value={formatNumber(createdThisWeek)}
              icon={CalendarDaysIcon}
              spark={createdSpark}
              sparkColor="orange"
              detail="Last 7 days"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-12">
            <Card className="gap-4 xl:col-span-8">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-sm">Clicks by link</CardTitle>
                  <CardDescription className="text-xs">
                    Your top links, all-time
                  </CardDescription>
                </div>
                <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                  {formatNumber(totalClicks)} total
                </span>
              </CardHeader>
              <CardContent>
                {chartRows.length > 0 && totalClicks > 0 ? (
                  <div className="h-[250px]">
                    <BarChart
                      data={chartRows}
                      config={clicksConfig}
                      className="h-full w-full"
                      bloom="aura"
                      margins={{ top: 8, right: 4, bottom: 24, left: 38 }}
                    >
                      <Grid horizontal strokeDasharray="2 4" />
                      <XAxis dataKey="label" maxTicks={6} />
                      <YAxis tickFormatter={formatAxisCount} tickCount={4} />
                      <Tooltip
                        labelKey="code"
                        valueFormatter={(value) =>
                          `${value.toLocaleString()} clicks`
                        }
                      />
                      <Bar dataKey="clicks" variant="gradient" />
                    </BarChart>
                  </div>
                ) : (
                  <EmptyPanel
                    title={
                      linksCount === 0
                        ? "No clicks to chart yet"
                        : "No clicks yet"
                    }
                    copy={
                      linksCount === 0
                        ? "Create a link and share it — the numbers will show up here."
                        : "Share one of your links. The first click will start the chart."
                    }
                  />
                )}
              </CardContent>
            </Card>

            <Card className="relative gap-4 overflow-hidden xl:col-span-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-foreground/[0.04] blur-3xl"
              />
              <CardHeader className="relative flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-sm">Top link</CardTitle>
                  <CardDescription className="text-xs">
                    The one doing the work
                  </CardDescription>
                </div>
                {topLink && topLink.clicks > 0 ? (
                  <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                    {topLinkShare}% of clicks
                  </span>
                ) : null}
              </CardHeader>
              <CardContent className="relative">
                {topLink ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start gap-3">
                      <LinkAvatar
                        slug={topLink.shortCode}
                        seed={hashString(topLink.shortCode)}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-mono text-[12px] font-medium">
                          {
                            splitShortUrl(topLink.shortUrl, topLink.shortCode)
                              .display
                          }
                        </p>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                          {topLink.originalUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-end justify-between gap-4 rounded-xl border border-border/70 bg-muted/30 p-3">
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
                          Clicks
                        </p>
                        <p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                          {formatNumber(topLink.clicks)}
                        </p>
                        <div className="mt-2 h-1 w-24 overflow-hidden rounded-full bg-background/80">
                          <div
                            className="h-full rounded-full bg-foreground/80"
                            style={{ width: `${Math.max(topLinkShare, 4)}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-20 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-white p-1.5 text-neutral-950">
                        <QrCode
                          value={topLink.shortUrl}
                          label={topLink.shortCode}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 flex-1 gap-1.5 text-[11px]"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              topLink.shortUrl
                            )
                            toast.success("Top link copied")
                          } catch {
                            toast.error("Could not copy the link")
                          }
                        }}
                      >
                        <CopyIcon className="size-3.5" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 flex-1 gap-1.5 bg-foreground text-[11px] text-background hover:bg-foreground/90"
                        onClick={() =>
                          window.open(
                            topLink.shortUrl,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        <ExternalLinkIcon className="size-3.5" />
                        Open
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
                      <Link2Icon className="size-4" />
                    </span>
                    <p className="text-sm font-medium">No links yet</p>
                    <p className="max-w-[15rem] text-xs leading-relaxed text-muted-foreground">
                      Your busiest link will live here once you create one.
                    </p>
                    <CreateLinkDialog label="Create your first link" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-12">
            <Card className="gap-4 xl:col-span-5">
              <CardHeader>
                <CardTitle className="text-sm">Where clicks land</CardTitle>
                <CardDescription className="text-xs">
                  Share of all-time clicks by link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClicksDonut urls={urls} height={215} />
              </CardContent>
            </Card>

            <Card className="gap-4 xl:col-span-7">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-sm">Links created</CardTitle>
                  <CardDescription className="text-xs">
                    The last 14 days of activity
                  </CardDescription>
                </div>
                <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                  {formatNumber(linksCount)} total
                </span>
              </CardHeader>
              <CardContent>
                <LinksCreatedArea urls={urls} days={14} height={215} />
              </CardContent>
            </Card>
          </div>

          <Card className="gap-0 py-0">
            <div className="flex items-center justify-between gap-3 px-4 py-4">
              <div>
                <CardTitle className="text-sm">Recent links</CardTitle>
                <CardDescription className="text-xs">
                  Your latest cuts
                </CardDescription>
              </div>
              <Link
                to="/dashboard/links"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                )}
              >
                View all
                <ArrowUpRightIcon className="size-3" />
              </Link>
            </div>

            <Table className="table-fixed sm:table-auto">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[58%] pl-4 text-[10px] tracking-[0.08em] uppercase sm:w-auto">
                    Link
                  </TableHead>
                  <TableHead className="w-20 text-right text-[10px] tracking-[0.08em] uppercase sm:w-auto">
                    Clicks
                  </TableHead>
                  <TableHead className="hidden text-[10px] tracking-[0.08em] uppercase lg:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="w-10 pr-4" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLinks.map((link) => {
                  const short = splitShortUrl(link.shortUrl, link.shortCode)
                  return (
                    <TableRow key={link.id} className="group">
                      <TableCell className="py-2.5 pl-4">
                        <div className="flex items-center gap-2.5">
                          <LinkAvatar
                            slug={link.shortCode}
                            seed={hashString(link.shortCode)}
                          />
                          <div className="min-w-0">
                            <p className="truncate font-mono text-[11px] font-medium">
                              {short.display}
                            </p>
                            <p className="max-w-[15rem] truncate text-[10px] text-muted-foreground">
                              {link.originalUrl}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-[11px] tabular-nums">
                        {formatNumber(link.clicks)}
                      </TableCell>
                      <TableCell
                        className="hidden font-mono text-[10px] text-muted-foreground lg:table-cell"
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

                {recentLinks.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-12 text-center">
                      <p className="text-sm font-medium">No links yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Create your first short link to get started.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="mt-auto flex items-center justify-between border-t border-border/70 px-4 py-3">
              <p className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.08em] text-muted-foreground uppercase">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {linksCount} link{linksCount === 1 ? "" : "s"} in your workspace
              </p>
              <Link
                to="/dashboard/links"
                className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Manage all links
              </Link>
            </div>
          </Card>
        </>
      )}
    </>
  )
}

function EmptyPanel({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="flex h-[250px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
      <span className="size-2.5 rotate-45 border border-foreground/40" />
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
        {copy}
      </p>
    </div>
  )
}

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[118px] rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <Skeleton className="h-[360px] rounded-2xl xl:col-span-8" />
        <Skeleton className="h-[360px] rounded-2xl xl:col-span-4" />
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <Skeleton className="h-[340px] rounded-2xl xl:col-span-5" />
        <Skeleton className="h-[340px] rounded-2xl xl:col-span-7" />
      </div>
      <Skeleton className="h-[320px] rounded-2xl" />
    </div>
  )
}
