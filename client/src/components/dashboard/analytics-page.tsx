import { useMemo, useState } from "react"
import { Link } from "@tanstack/react-router"
import {
  BarChart3Icon,
  ChartColumnIcon,
  ChartLineIcon,
  DownloadIcon,
  Link2Icon,
  MousePointerClickIcon,
  RefreshCwIcon,
  TrophyIcon,
} from "lucide-react"
import { toast } from "sonner"
import { ClicksDonut } from "@/components/dashboard/clicks-donut"
import { useDashboardData } from "@/components/dashboard/dashboard-data"
import { LinkAvatar } from "@/components/dashboard/link-avatar"
import {
  buildWorkspaceGrowthRows,
  LinksCreatedArea,
} from "@/components/dashboard/links-created-chart"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { Line } from "@/components/dither-kit/area"
import { LineChart } from "@/components/dither-kit/area-chart"
import { Bar } from "@/components/dither-kit/bar"
import { BarChart } from "@/components/dither-kit/bar-chart"
import type { ChartConfig } from "@/components/dither-kit/chart-context"
import { Dot } from "@/components/dither-kit/dot"
import { Grid } from "@/components/dither-kit/grid"
import { Tooltip } from "@/components/dither-kit/tooltip"
import { XAxis } from "@/components/dither-kit/x-axis"
import { YAxis } from "@/components/dither-kit/y-axis"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { downloadLinksCsv } from "@/lib/csv"
import {
  formatAxisCount,
  formatDate,
  formatNumber,
  formatRelative,
  hashString,
  splitShortUrl,
} from "@/lib/format"
import { cn } from "cn"

const clicksConfig: ChartConfig = {
  clicks: { label: "Clicks", color: "blue" },
}

const growthConfig: ChartConfig = {
  total: { label: "Links", color: "orange" },
}

export function AnalyticsPage() {
  const { urls, loading, error, refresh } = useDashboardData()
  const [clicksView, setClicksView] = useState<"bar" | "line">("bar")

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0)
  const linksCount = urls.length
  const averageClicks = linksCount ? Math.round(totalClicks / linksCount) : 0
  const topLinks = [...urls].sort((a, b) => b.clicks - a.clicks).slice(0, 8)
  const topLink = topLinks.at(0)

  const clickRows = topLinks.map((url) => ({
    label: url.shortCode.slice(0, 6),
    code: url.shortCode,
    clicks: url.clicks,
  }))

  const growthRows = useMemo(() => buildWorkspaceGrowthRows(urls, 30), [urls])

  const recentLinks = [...urls]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  function exportReport() {
    if (urls.length === 0) return
    downloadLinksCsv(urls)
    toast.success("Report exported", {
      description: `${urls.length} link${urls.length === 1 ? "" : "s"} included.`,
    })
  }

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="The numbers your links actually report — clicks, cuts, and everything in between."
      >
        <span className="inline-flex h-9 items-center rounded-xl border border-border bg-card px-3 font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          All time
        </span>
        <Button
          className="h-9 gap-1.5 rounded-xl"
          onClick={exportReport}
          disabled={urls.length === 0}
        >
          <DownloadIcon className="size-3.5" />
          Export
        </Button>
      </PageHeader>

      {loading ? (
        <AnalyticsSkeleton />
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="grid size-10 place-items-center rounded-full bg-destructive/10 text-destructive">
              <RefreshCwIcon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">Could not load analytics</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                {error}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => void refresh()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : urls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="size-2.5 rotate-45 border border-brand" />
            <p className="text-sm font-medium">No data yet</p>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Create a link and share it. Clicks will start showing up here as
              soon as someone opens it.
            </p>
            <Link
              to="/dashboard"
              className="text-xs font-medium underline decoration-border underline-offset-4"
            >
              Back to overview
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total clicks"
              value={formatNumber(totalClicks)}
              icon={MousePointerClickIcon}
              detail="Lifetime, across all links"
            />
            <StatCard
              label="Links"
              value={formatNumber(linksCount)}
              icon={Link2Icon}
              detail="In your workspace"
            />
            <StatCard
              label="Clicks per link"
              value={formatNumber(averageClicks)}
              icon={BarChart3Icon}
              detail="Average across every link"
            />
            <StatCard
              label="Top link"
              value={formatNumber(topLink?.clicks ?? 0)}
              icon={TrophyIcon}
              detail={topLink ? `/${topLink.shortCode}` : "No clicks yet"}
            />
          </div>

          <Card className="gap-4">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-sm">Clicks by link</CardTitle>
                <CardDescription className="text-xs">
                  Your top {clickRows.length} link
                  {clickRows.length === 1 ? "" : "s"}, all-time
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                  {formatNumber(totalClicks)} total
                </span>
                <div className="flex items-center rounded-lg border border-border/70 bg-muted/40 p-0.5">
                  <button
                    type="button"
                    onClick={() => setClicksView("bar")}
                    aria-pressed={clicksView === "bar"}
                    className={cn(
                      "flex h-6 items-center gap-1 rounded-md px-2 text-[10px] font-medium transition-colors",
                      clicksView === "bar"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ChartColumnIcon className="size-3" />
                    Bars
                  </button>
                  <button
                    type="button"
                    onClick={() => setClicksView("line")}
                    aria-pressed={clicksView === "line"}
                    className={cn(
                      "flex h-6 items-center gap-1 rounded-md px-2 text-[10px] font-medium transition-colors",
                      clicksView === "line"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ChartLineIcon className="size-3" />
                    Line
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {clicksView === "bar" ? (
                  <BarChart
                    data={clickRows}
                    config={clicksConfig}
                    className="h-full w-full"
                    bloom="aura"
                    margins={{ top: 8, right: 4, bottom: 26, left: 38 }}
                  >
                    <Grid horizontal strokeDasharray="2 4" />
                    <XAxis dataKey="label" maxTicks={8} />
                    <YAxis tickFormatter={formatAxisCount} tickCount={4} />
                    <Tooltip
                      labelKey="code"
                      valueFormatter={(value) =>
                        `${value.toLocaleString()} clicks`
                      }
                    />
                    <Bar dataKey="clicks" variant="gradient" />
                  </BarChart>
                ) : (
                  <LineChart
                    data={clickRows}
                    config={clicksConfig}
                    className="h-full w-full"
                    bloom="low"
                    margins={{ top: 12, right: 8, bottom: 26, left: 38 }}
                  >
                    <Grid horizontal strokeDasharray="2 4" />
                    <XAxis dataKey="label" maxTicks={8} />
                    <YAxis tickFormatter={formatAxisCount} tickCount={4} />
                    <Tooltip
                      labelKey="code"
                      valueFormatter={(value) =>
                        `${value.toLocaleString()} clicks`
                      }
                    />
                    <Line dataKey="clicks" variant="gradient">
                      <Dot variant="filled" r={2} />
                    </Line>
                  </LineChart>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-12">
            <Card className="gap-4 xl:col-span-5">
              <CardHeader>
                <CardTitle className="text-sm">Where clicks land</CardTitle>
                <CardDescription className="text-xs">
                  Share of all-time clicks by link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClicksDonut urls={urls} height={220} />
              </CardContent>
            </Card>

            <Card className="gap-4 xl:col-span-7">
              <CardHeader>
                <CardTitle className="text-sm">Links created</CardTitle>
                <CardDescription className="text-xs">
                  The making of your workspace, last 14 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LinksCreatedArea urls={urls} days={14} height={220} />
              </CardContent>
            </Card>
          </div>

          <Card className="gap-4">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-sm">Workspace growth</CardTitle>
                <CardDescription className="text-xs">
                  Cumulative links over the last 30 days
                </CardDescription>
              </div>
              <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                {formatNumber(linksCount)} total
              </span>
            </CardHeader>
            <CardContent>
              <div className="h-[210px]">
                <LineChart
                  data={growthRows}
                  config={growthConfig}
                  className="h-full w-full"
                  bloom="low"
                  margins={{ top: 12, right: 6, bottom: 24, left: 30 }}
                >
                  <Grid horizontal strokeDasharray="2 4" />
                  <XAxis dataKey="label" maxTicks={6} />
                  <YAxis tickFormatter={formatAxisCount} tickCount={3} />
                  <Tooltip
                    labelKey="label"
                    valueFormatter={(value) =>
                      `${value} link${value === 1 ? "" : "s"}`
                    }
                  />
                  <Line dataKey="total" variant="gradient">
                    <Dot variant="filled" r={1.8} />
                  </Line>
                </LineChart>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-12">
            <Card className="gap-4 xl:col-span-7">
              <CardHeader>
                <CardTitle className="text-sm">Top links</CardTitle>
                <CardDescription className="text-xs">
                  Ranked by all-time clicks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5">
                {topLinks.slice(0, 5).map((link, index) => {
                  const max = topLink?.clicks || 1
                  return (
                    <div key={link.id} className="flex items-center gap-2.5">
                      <span className="w-4 shrink-0 font-mono text-[9px] text-muted-foreground tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <LinkAvatar
                        seed={hashString(link.shortCode)}
                        slug={link.shortCode}
                        className="size-7 rounded-md text-[10px]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-mono text-[11px]">
                            /{link.shortCode}
                          </span>
                          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                            {formatNumber(link.clicks)} clicks
                          </span>
                        </div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-foreground/80"
                            style={{
                              width: `${Math.max(
                                2,
                                (link.clicks / max) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="gap-0 py-0 xl:col-span-5">
              <CardHeader className="px-4 py-4">
                <CardTitle className="text-sm">Recently created</CardTitle>
                <CardDescription className="text-xs">
                  The newest cuts in your workspace
                </CardDescription>
              </CardHeader>
              <div className="divide-y divide-border/70 border-t border-border/70">
                {recentLinks.map((link) => {
                  const short = splitShortUrl(link.shortUrl, link.shortCode)
                  return (
                    <div
                      key={link.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <LinkAvatar
                        seed={hashString(link.shortCode)}
                        slug={link.shortCode}
                        className="size-7 rounded-md text-[10px]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-[11px] font-medium">
                          {short.display}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {link.originalUrl}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-[10px] tabular-nums">
                          {formatNumber(link.clicks)} clicks
                        </p>
                        <p
                          className="text-[9px] text-muted-foreground"
                          title={formatDate(link.createdAt)}
                        >
                          {formatRelative(link.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[118px] rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-[420px] rounded-2xl" />
      <div className="grid gap-4 xl:grid-cols-12">
        <Skeleton className="h-[320px] rounded-2xl xl:col-span-5" />
        <Skeleton className="h-[320px] rounded-2xl xl:col-span-7" />
      </div>
    </div>
  )
}
