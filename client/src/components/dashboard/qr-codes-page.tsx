import { Link } from "@tanstack/react-router"
import {
  ArrowRightIcon,
  CopyIcon,
  DownloadIcon,
  QrCodeIcon,
  RefreshCwIcon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"
import { CreateLinkDialog } from "@/components/dashboard/create-link-dialog"
import { useDashboardData } from "@/components/dashboard/dashboard-data"
import { LinkAvatar } from "@/components/dashboard/link-avatar"
import { PageHeader } from "@/components/dashboard/page-header"
import { QrCode } from "@/components/qr-code"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { ApiUrl } from "@/lib/api"
import {
  formatNumber,
  formatRelative,
  hashString,
  splitShortUrl,
} from "@/lib/format"

export function QrCodesPage() {
  const { urls, loading, error, refresh } = useDashboardData()

  async function copy(link: ApiUrl) {
    try {
      await navigator.clipboard.writeText(link.shortUrl)
      toast.success("Link copied", { description: link.shortUrl })
    } catch {
      toast.error("Could not copy the link")
    }
  }

  function download(link: ApiUrl) {
    const container = document.getElementById(`qr-${link.id}`)
    const svg = container?.querySelector("svg")
    if (!svg) {
      toast.error("QR code is not ready yet")
      return
    }

    const clone = svg.cloneNode(true) as SVGElement
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    const source = new XMLSerializer().serializeToString(clone)
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" })
    const href = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = href
    anchor.download = `${link.shortCode}-qr.svg`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(href)
    toast.success("QR code downloaded", {
      description: `${link.shortCode}-qr.svg`,
    })
  }

  return (
    <>
      <PageHeader
        eyebrow="Print & share"
        title="QR codes"
        description="Scannable twins for every link — print, share, track."
      >
        <CreateLinkDialog label="New QR code" />
      </PageHeader>

      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 pattern-45 [mask-image:linear-gradient(to_left,black,transparent)] text-foreground/[0.07]"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2 py-0.5 font-mono text-[9px] tracking-[0.08em] text-muted-foreground uppercase">
              <SparklesIcon className="size-3" />
              Print-ready
            </span>
            <h2 className="mt-2.5 text-lg font-semibold tracking-[-0.02em]">
              Every link has a scannable twin.
            </h2>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
              Print it on a menu, a poster, or a business card. A scan is just
              another click, so it lands in the same dashboard.
            </p>
          </div>
          <div className="hidden shrink-0 rounded-xl border border-black/10 bg-white p-2 text-neutral-950 sm:block">
            <div className="size-20">
              <QrCode value="https://knot.link/demo" label="Example QR" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[330px] rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="grid size-10 place-items-center rounded-full bg-destructive/10 text-destructive">
              <RefreshCwIcon className="size-4" />
            </span>
            <p className="text-sm font-medium">Could not load your links</p>
            <p className="max-w-sm text-xs text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void refresh()}>
              Try again
            </Button>
          </div>
        </Card>
      ) : urls.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
              <QrCodeIcon className="size-4" />
            </span>
            <p className="text-sm font-medium">No codes yet</p>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Create a link first. Its QR code will appear here, ready to
              download.
            </p>
            <CreateLinkDialog label="Create your first link" />
          </div>
        </Card>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {urls.map((link) => {
            const short = splitShortUrl(link.shortUrl, link.shortCode)
            return (
              <Card key={link.id} className="group gap-0 overflow-hidden py-0">
                <div className="relative grid place-items-center bg-gradient-to-br from-foreground/[0.03] via-transparent to-transparent p-6">
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-2 py-0.5 font-mono text-[8px] tracking-[0.08em] text-muted-foreground uppercase">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Live
                  </div>
                  <div
                    id={`qr-${link.id}`}
                    className="rounded-xl border border-black/10 bg-white p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-[1.03] group-hover:-rotate-2"
                  >
                    <div className="size-28">
                      <QrCode
                        value={link.shortUrl}
                        label={`QR code for ${link.shortCode}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/70 p-4">
                  <div className="flex items-start gap-2.5">
                    <LinkAvatar
                      seed={hashString(link.shortCode)}
                      slug={link.shortCode}
                      className="size-7 rounded-md text-[10px]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs font-medium">
                        {short.display}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {formatNumber(link.clicks)} clicks ·{" "}
                        {formatRelative(link.createdAt)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 text-muted-foreground"
                      aria-label={`Copy ${link.shortCode} link`}
                      onClick={() => void copy(link)}
                    >
                      <CopyIcon className="size-3.5" />
                    </Button>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex-1 gap-1.5 text-[11px]"
                      onClick={() => download(link)}
                    >
                      <DownloadIcon className="size-3.5" />
                      Download
                    </Button>
                    <Link
                      to="/dashboard/analytics"
                      className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`View analytics for ${link.shortCode}`}
                    >
                      <ArrowRightIcon className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}
