import type { LucideIcon } from "lucide-react"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Sparkline } from "@/components/dither-kit/sparkline"
import type { DitherColor } from "@/components/dither-kit/palette"
import { cn } from "cn"

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  spark,
  sparkColor = "green",
  hint = "vs last period",
  detail,
  className,
}: {
  label: string
  value: string
  change?: number
  icon: LucideIcon
  spark?: number[]
  sparkColor?: DitherColor
  hint?: string
  detail?: string
  className?: string
}) {
  const hasSpark = Array.isArray(spark) && spark.length > 1
  const hasTrend = typeof change === "number" && hasSpark
  const positive = (change ?? 0) >= 0

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-[0_1px_0_0_rgba(255,255,255,0.35)_inset] transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)] sm:p-5 dark:shadow-none",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-8 size-24 rounded-full bg-foreground/[0.04] blur-2xl transition-opacity duration-300 group-hover:opacity-100 sm:opacity-0"
      />

      <div className="relative flex items-start justify-between gap-3">
        <p className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </p>
        <span className="grid size-8 shrink-0 place-items-center rounded-xl border border-border/70 bg-muted/50 text-muted-foreground transition-colors duration-300 group-hover:border-foreground/20 group-hover:text-foreground">
          <Icon className="size-3.5" />
        </span>
      </div>

      <div className="relative mt-3 flex items-end justify-between gap-2">
        <p className="text-[1.75rem] leading-none font-semibold tracking-[-0.05em] tabular-nums">
          {value}
        </p>
        {hasSpark ? (
          <div className="mb-0.5 h-9 w-20 shrink-0 opacity-80 transition-opacity group-hover:opacity-100">
            <Sparkline
              data={spark}
              color={sparkColor}
              variant="dotted"
              bloomOnHover
              className="h-full w-full"
            />
          </div>
        ) : null}
      </div>

      {hasTrend ? (
        <p className="relative mt-2 flex items-center gap-1 text-[11px]">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              positive
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {positive ? (
              <TrendingUpIcon className="size-3" />
            ) : (
              <TrendingDownIcon className="size-3" />
            )}
            {positive ? "+" : ""}
            {change}%
          </span>
          <span className="text-muted-foreground">{hint}</span>
        </p>
      ) : (
        <p className="relative mt-2 text-[11px] text-muted-foreground">
          {detail}
        </p>
      )}
    </div>
  )
}
