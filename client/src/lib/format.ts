export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatCompact(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`
  }
  return String(value)
}

export function formatAxisCount(value: number) {
  if (!Number.isInteger(value)) return ""
  return formatCompact(value)
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function formatDateShort(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

export function formatRelative(value: string | Date) {
  const time = new Date(value).getTime()
  const diff = Date.now() - time

  if (Number.isNaN(time)) return "—"
  if (diff < 45_000) return "just now"

  const minutes = Math.floor(diff / 60_000)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

export function splitShortUrl(shortUrl: string, fallbackCode: string) {
  try {
    const url = new URL(shortUrl)
    const path = url.pathname.replace(/^\//, "")
    return {
      href: url.toString(),
      host: url.host,
      code: path || fallbackCode,
      display: `${url.host}/${path || fallbackCode}`,
    }
  } catch {
    return {
      href: shortUrl,
      host: "",
      code: fallbackCode,
      display: shortUrl,
    }
  }
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "K"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function hashString(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0
  }
  return Math.abs(hash)
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}
