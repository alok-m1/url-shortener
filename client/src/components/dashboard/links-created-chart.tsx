"use client"

import { useMemo } from "react"
import { Area } from "@/components/dither-kit/area"
import { AreaChart } from "@/components/dither-kit/area-chart"
import type { ChartConfig } from "@/components/dither-kit/chart-context"
import { Grid } from "@/components/dither-kit/grid"
import { Tooltip } from "@/components/dither-kit/tooltip"
import { XAxis } from "@/components/dither-kit/x-axis"
import { YAxis } from "@/components/dither-kit/y-axis"
import { formatAxisCount } from "@/lib/format"
import type { ApiUrl } from "@/lib/api"
import { cn } from "cn"

const createdConfig: ChartConfig = {
  links: { label: "Links created", color: "purple" },
}

export function buildLinksCreatedRows(urls: ApiUrl[], days: number) {
  const now = new Date()
  const rows = Array.from({ length: days }, (_, index) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (days - 1 - index))
    return {
      date,
      label: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date),
      links: 0,
    }
  })

  for (const url of urls) {
    const created = new Date(url.createdAt)
    const row = rows.find(
      (day) => day.date.toDateString() === created.toDateString()
    )
    if (row) row.links += 1
  }

  return rows.map(({ label, links }) => ({ label, links }))
}

export function buildWorkspaceGrowthRows(urls: ApiUrl[], days: number) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (days - 1))

  const existing = urls.filter(
    (url) => new Date(url.createdAt).getTime() < start.getTime()
  ).length

  let running = existing
  return buildLinksCreatedRows(urls, days).map((row) => {
    running += row.links
    return { label: row.label, total: running }
  })
}

export function LinksCreatedArea({
  urls,
  days = 14,
  height = 220,
  className,
}: {
  urls: ApiUrl[]
  days?: number
  height?: number
  className?: string
}) {
  const rows = useMemo(() => buildLinksCreatedRows(urls, days), [days, urls])

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <AreaChart
        data={rows}
        config={createdConfig}
        className="h-full w-full"
        bloom="low"
        margins={{ top: 12, right: 6, bottom: 24, left: 30 }}
      >
        <Grid horizontal strokeDasharray="2 4" />
        <XAxis dataKey="label" maxTicks={5} />
        <YAxis tickFormatter={formatAxisCount} tickCount={3} />
        <Tooltip
          labelKey="label"
          valueFormatter={(value) => `${value} link${value === 1 ? "" : "s"}`}
        />
        <Area dataKey="links" variant="gradient" />
      </AreaChart>
    </div>
  )
}
