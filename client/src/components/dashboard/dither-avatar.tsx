"use client"

import { useId, useMemo } from "react"
import { BAYER } from "@/components/dither-kit/dither-paint"
import {
  rgb,
  seedOfColor,
  type DitherColor,
} from "@/components/dither-kit/palette"
import { hashString } from "@/lib/format"
import { cn } from "cn"

const GRID = 11
const MIRRORED_COLS = Math.ceil(GRID / 2)
const VIEW = 72
const PAD = 2
const CELL = (VIEW - PAD * 2) / GRID

function mulberry32(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value + 0x6d2b79f5) >>> 0
    let result = value
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * A deterministic dither portrait derived from a name. The pattern is mirrored
 * left-to-right like a classic identicon, then textured with the same Bayer
 * matrix the dither charts use so it belongs to the rest of the visual system.
 */
export function DitherAvatar({
  name,
  color = "blue",
  className,
}: {
  name: string
  color?: DitherColor
  className?: string
}) {
  const rawId = useId()
  const patternId = `dither-avatar-dots-${rawId.replace(/[^a-zA-Z0-9-]/g, "")}`
  const shadeId = `dither-avatar-shade-${rawId.replace(/[^a-zA-Z0-9-]/g, "")}`
  const seed = seedOfColor(color)

  const columns = useMemo(() => {
    const random = mulberry32(hashString(name.trim().toLowerCase() || "knot"))
    return Array.from({ length: MIRRORED_COLS }, () =>
      Array.from({ length: GRID }, () => random())
    )
  }, [name])

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      role="img"
      aria-label={`Dither portrait generated from ${name}`}
      className={cn("block overflow-hidden", className)}
    >
      <defs>
        <pattern
          id={patternId}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <rect width="4" height="4" fill={rgb(seed.fill, 1, 0.07)} />
          <circle cx="1" cy="1" r="0.55" fill={rgb(seed.fill, 1, 0.28)} />
        </pattern>
        <linearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="0.52" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <rect width={VIEW} height={VIEW} fill={`url(#${patternId})`} />

      {columns.map((column, columnIndex) =>
        column.map((value, rowIndex) => {
          const threshold = BAYER[rowIndex % 4][columnIndex % 4]
          let alpha = 0

          if (value > 0.66) alpha = 0.94
          else if (value > 0.54) alpha = 0.68
          else if (value > 0.46) alpha = threshold > 0.5 ? 0.4 : 0.1
          else if (value > 0.38) alpha = threshold > 0.72 ? 0.16 : 0.035
          else alpha = threshold > 0.84 ? 0.08 : 0

          if (alpha === 0) return null

          const mirroredIndex = GRID - 1 - columnIndex
          const y = PAD + rowIndex * CELL
          const fill = rgb(seed.fill, 1, alpha)

          return (
            <g key={`${columnIndex}-${rowIndex}`}>
              <rect
                x={PAD + columnIndex * CELL}
                y={y}
                width={CELL + 0.2}
                height={CELL + 0.2}
                rx={CELL * 0.16}
                fill={fill}
              />
              {mirroredIndex !== columnIndex && (
                <rect
                  x={PAD + mirroredIndex * CELL}
                  y={y}
                  width={CELL + 0.2}
                  height={CELL + 0.2}
                  rx={CELL * 0.16}
                  fill={fill}
                />
              )}
            </g>
          )
        })
      )}

      <rect
        width={VIEW}
        height={VIEW}
        fill={`url(#${shadeId})`}
        pointerEvents="none"
      />
    </svg>
  )
}
