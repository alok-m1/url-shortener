import { useSyncExternalStore } from "react"
import {
  isDitherColor,
  type DitherColor,
} from "@/components/dither-kit/palette"

export const AVATAR_COLORS: {
  value: DitherColor
  label: string
}[] = [
  { value: "green", label: "Acid" },
  { value: "blue", label: "Cobalt" },
  { value: "purple", label: "Iris" },
  { value: "pink", label: "Rose" },
  { value: "orange", label: "Amber" },
  { value: "red", label: "Coral" },
  { value: "grey", label: "Graphite" },
]

export const DEFAULT_AVATAR_COLOR: DitherColor = "blue"
const STORAGE_KEY = "knot:avatar-color"

let cached: DitherColor | null = null
const listeners = new Set<() => void>()

function readStored(): DitherColor {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return isDitherColor(value) ? value : DEFAULT_AVATAR_COLOR
  } catch {
    return DEFAULT_AVATAR_COLOR
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  function onStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY) return
    cached = readStored()
    listener()
  }

  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function getSnapshot(): DitherColor {
  if (cached === null) cached = readStored()
  return cached
}

function getServerSnapshot(): DitherColor {
  return DEFAULT_AVATAR_COLOR
}

export function setAvatarColor(color: DitherColor) {
  cached = color
  try {
    window.localStorage.setItem(STORAGE_KEY, color)
  } catch {
    // Storage can be unavailable in private modes; the choice still applies
    // for the current page.
  }
  for (const listener of listeners) listener()
}

export function resetAvatarColor() {
  cached = DEFAULT_AVATAR_COLOR
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore unavailable storage.
  }
  for (const listener of listeners) listener()
}

export function useAvatarColor() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
