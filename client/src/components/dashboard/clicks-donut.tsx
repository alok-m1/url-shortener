"use client"

import { useMemo } from "react"
import { BlockLegend } from "@/components/dither-kit/block-legend"
import type { ChartConfig } from "@/components/dither-kit/chart-context"
import type { DitherColor } from "@/components/dither-kit/palette"
import { Pie } from "@/components/dither-kit/pie"
import { PieChart } from "@/components/dither-kit/pie-chart"
import { Tooltip } from "@/components/dither-kit/tooltip"
import { formatNumber } from "@/lib/format"
import type { ApiUrl } from "@/lib/api"
import { cn } from "cn"

const SLICE_COLORS: DitherColor[] = [
  "blue",
  "purple",
  "orange",
  "pink",
  "red",
  "green",
]

type DonutRow = { name: string; clicks: number }

export function ClicksDonut({
  urls,
  height = 220,
  className,
}: {
  urls: ApiUrl[]
  height?: number
  className?: string
}) {
  const { rows, config, values, total } = useMemo(() => {
    const ranked = urls
      .filter((url) => url.clicks > 0)
      .sort((a, b) => b.clicks - a.clicks)
    const top = ranked.slice(0, 4)
    const otherClicks = ranked
      .slice(4)
      .reduce((sum, url) => sum + url.clicks, 0)

    const nextRows: DonutRow[] = top.map((url) => ({
      name: `/${url.shortCode}`,
      clicks: url.clicks,
    }))

    if (otherClicks > 0) {
      nextRows.push({ name: "Other links", clicks: otherClicks })
    }

    const nextConfig: ChartConfig = {}
    const nextValues: Record<string, number> = {}

    nextRows.forEach((row, index) => {
      nextConfig[row.name] = {
        label: row.name,
        color: SLICE_COLORS[index % SLICE_COLORS.length],
      }
      nextValues[row.name] = row.clicks
    })

    return {
      rows: nextRows,
      config: nextConfig,
      values: nextValues,
      total: ranked.reduce((sum, url) => sum + url.clicks, 0),
    }
  }, [urls])

  if (rows.length === 0) {
    return (
      <div
        className={cn(
          "grid place-items-center rounded-xl border border-dashed border-border bg-muted/15 px-6 text-center",
          className
        )}
        style={{ height }}
      >
        <div>
          <span className="mx-auto block size-2 rotate-45 border border-brand" />
          <p className="mt-2.5 text-sm font-medium">No clicks to split yet</p>
          <p className="mt-1 max-w-[15rem] text-xs leading-relaxed text-muted-foreground">
            Share a link and this ring fills up with where your clicks land.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="relative" style={{ height }}>
        <PieChart
          data={rows}
          config={config}
          dataKey="clicks"
          nameKey="name"
          innerRadius={0.7}
          className="h-full w-full"
          bloom="low"
          margins={{ top: 6, right: 6, bottom: 6, left: 6 }}
        >
          <Pie variant="gradient" />
          <Tooltip
            valueFormatter={(value) => `${formatNumber(value)} clicks`}
          />
        </PieChart>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-mono text-[8px] tracking-[0.14em] text-muted-foreground uppercase">
              Total clicks
            </p>
            <p className="mt-0.5 text-2xl leading-none font-semibold tracking-[-0.05em] tabular-nums">
              {formatNumber(total)}
            </p>
          </div>
        </div>
      </div>

      <BlockLegend
        config={config}
        values={values}
        valueFormatter={(value) => formatNumber(value)}
        className="justify-center gap-x-3"
      />
    </div>
  )
}
