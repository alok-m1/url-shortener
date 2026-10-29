import { Link } from "@tanstack/react-router"
import { cn } from "cn"

export function KnotMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-4", className)}
    >
      <path
        d="M7 8.25A3.75 3.75 0 0 1 10.75 4.5h2.5A3.75 3.75 0 0 1 17 8.25 3.75 3.75 0 0 1 13.25 12h-2.5A3.75 3.75 0 0 0 7 15.75a3.75 3.75 0 0 0 3.75 3.75h2.5A3.75 3.75 0 0 0 17 15.75"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Logo({
  className,
  wordmark = true,
  to = "/",
}: {
  className?: string
  wordmark?: boolean
  to?: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group/logo inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      aria-label="knot — home"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover/logo:-rotate-6">
        <KnotMark className="size-[18px]" />
      </span>
      {wordmark && (
        <span className="text-[19px] leading-none font-semibold tracking-[-0.03em]">
          knot<span className="text-brand">.</span>
        </span>
      )}
    </Link>
  )
}
