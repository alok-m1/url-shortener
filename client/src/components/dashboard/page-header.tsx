import type { ReactNode } from "react"
import { cn } from "cn"

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string
  title: ReactNode
  description?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="relative pl-4">
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-0 w-[2px] rounded-full bg-brand"
        />
        <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[1.9rem] leading-[1.02] font-semibold tracking-[-0.05em] sm:text-[2.15rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {children}
        </div>
      )}
    </div>
  )
}
