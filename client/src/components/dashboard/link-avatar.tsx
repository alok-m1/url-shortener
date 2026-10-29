import { cn } from "cn"

const palette = [
  "bg-brand/25 text-brand-foreground dark:bg-brand/15 dark:text-brand",
  "bg-[#dbeafe] text-[#1e3a8a] dark:bg-[#1e3a8a]/30 dark:text-[#bfdbfe]",
  "bg-[#fce7f3] text-[#831843] dark:bg-[#831843]/30 dark:text-[#fbcfe8]",
  "bg-[#ede9fe] text-[#4c1d95] dark:bg-[#4c1d95]/30 dark:text-[#ddd6fe]",
  "bg-[#ffedd5] text-[#7c2d12] dark:bg-[#7c2d12]/30 dark:text-[#fed7aa]",
  "bg-[#ccfbf1] text-[#134e4a] dark:bg-[#134e4a]/30 dark:text-[#99f6e4]",
]

export function LinkAvatar({
  seed,
  slug,
  className,
}: {
  seed: number
  slug: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg font-mono text-[11px] font-semibold",
        palette[seed % palette.length],
        className
      )}
    >
      {slug.slice(0, 1).toUpperCase()}
    </span>
  )
}
