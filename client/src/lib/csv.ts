import type { ApiUrl } from "@/lib/api"

function escapeCell(value: string | number) {
  const text = String(value)
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`
  return text
}

export function downloadLinksCsv(urls: ApiUrl[]) {
  const header = [
    "short_code",
    "short_url",
    "destination",
    "clicks",
    "created_at",
  ]
  const rows = urls.map((url) => [
    url.shortCode,
    url.shortUrl,
    url.originalUrl,
    url.clicks,
    url.createdAt,
  ])
  const csv = [header, ...rows]
    .map((row) => row.map(escapeCell).join(","))
    .join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const href = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = href
  anchor.download = `knot-links-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(href)
}
