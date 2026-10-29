import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  Link2Icon,
  MousePointerClickIcon,
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkline } from "@/components/dither-kit/sparkline"
import { QrCode } from "@/components/qr-code"
import { api, getApiErrorMessage } from "@/lib/api"
import { splitShortUrl } from "@/lib/format"

const chartData = [10, 16, 13, 22, 19, 28, 24, 38, 33, 47, 42, 58, 64]

const capabilities = [
  {
    title: "Short links",
    copy: "Small, memorable, and yours.",
  },
  {
    title: "Live analytics",
    copy: "Clicks, sources, and places.",
  },
  {
    title: "QR codes",
    copy: "Print it. Scan it. Track it.",
  },
  {
    title: "API access",
    copy: "Make it part of your stack.",
  },
]

export function Hero() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [url, setUrl] = useState("")
  const [shortLink, setShortLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleShorten(event: React.FormEvent) {
    event.preventDefault()
    if (!url.trim() || loading) return

    if (!user) {
      toast.info("Sign in to create a short link", {
        description: "Your links and clicks live in your workspace.",
      })
      navigate({ to: "/login" })
      return
    }

    setLoading(true)
    try {
      const created = await api.createUrl(url.trim())
      setShortLink(created.shortUrl)
      toast.success("Short link created", {
        description: "Your link is ready to share.",
      })
    } catch (error) {
      toast.error("Could not shorten the link", {
        description: getApiErrorMessage(error),
      })
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    if (!shortLink) return
    try {
      await navigator.clipboard.writeText(shortLink)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Could not copy — try selecting it manually")
    }
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[44%] pattern-45 [mask-image:linear-gradient(to_left,black,transparent_92%)] text-foreground/[0.055] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-56 -right-32 size-[38rem] rounded-full bg-brand/25 blur-[130px] dark:bg-brand/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 -left-52 size-[28rem] rounded-full bg-emerald-500/10 blur-[120px]"
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:py-24">
            <div className="min-w-0">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-9 bg-brand" />
                <span className="text-[11px] text-muted-foreground">
                  A quieter link manager
                </span>
              </div>

              <h1 className="text-[clamp(3rem,7.2vw,5.6rem)] leading-[0.92] font-semibold tracking-[-0.055em] text-balance">
                Long links,
                <br />
                <span className="isolate inline-block font-display text-[1.04em] leading-[1.02] font-normal tracking-[-0.02em]">
                  <span className="underline-sketch">tied neatly.</span>
                </span>
              </h1>

              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                Knot turns unwieldy URLs into short, memorable links — with live
                click analytics, QR codes, and team controls built in.
              </p>

              <form onSubmit={handleShorten} className="mt-8 max-w-lg">
                <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-card p-1.5 pl-3 shadow-[0_20px_60px_-32px_rgba(0,0,0,0.45)] transition-shadow focus-within:border-ring/60 focus-within:ring-3 focus-within:ring-ring/15">
                  <Link2Icon className="size-4 shrink-0 text-muted-foreground" />
                  <Input
                    type="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="Paste a long link…"
                    aria-label="URL to shorten"
                    className="h-10 min-w-0 border-0 bg-transparent px-2 text-[15px] shadow-none placeholder:text-muted-foreground/80 focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent"
                  />
                  <Button
                    type="submit"
                    className="h-10 shrink-0 gap-1.5 rounded-xl px-4"
                    disabled={loading || !url.trim()}
                  >
                    {loading ? "Tying…" : "Shorten"}
                    {!loading && <ArrowRightIcon className="size-4" />}
                  </Button>
                </div>

                {shortLink ? (
                  <div className="mt-2.5 flex animate-in items-center gap-3 rounded-xl border border-brand/50 bg-brand/15 py-1.5 pr-1.5 pl-3 fade-in slide-in-from-top-1">
                    <span className="grid size-5 place-items-center rounded-full bg-brand text-brand-foreground">
                      <CheckIcon className="size-3" />
                    </span>
                    <span className="truncate font-mono text-[13px] font-medium">
                      {splitShortUrl(shortLink, "").display}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-auto shrink-0 gap-1.5"
                      onClick={copyLink}
                    >
                      <CopyIcon className="size-3.5" />
                      Copy
                    </Button>
                  </div>
                ) : (
                  <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                    <span>Free plan</span>
                    <span className="text-border">·</span>
                    <span>Sign in to save</span>
                    <span className="text-border">·</span>
                    <span>Unlimited clicks</span>
                  </p>
                )}
              </form>

              <p className="mt-8 max-w-md text-[12px] leading-relaxed text-muted-foreground">
                For studios, founders, and anyone who cares where the link
                actually goes.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[500px] lg:mr-0 lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute -top-5 -right-5 h-44 w-44 pattern-45 text-brand/30"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-8 -left-8 h-36 w-36 pattern-45 text-foreground/[0.07]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-10 rounded-full bg-brand/25 blur-[80px] dark:bg-brand/12"
              />
              <div
                aria-hidden="true"
                className="absolute inset-2 rounded-[2.2rem] border border-dashed border-border/80"
              />

              <div className="relative z-10 animate-in duration-700 zoom-in-95 fade-in">
                <div className="relative rounded-2xl border border-border bg-card shadow-[0_45px_90px_-50px_rgba(0,0,0,0.55)]">
                  <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5 sm:px-5">
                    <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
                      <span className="size-1.5 rounded-full bg-brand" />
                      Demo workspace
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/25 text-brand-foreground dark:text-brand">
                          <Link2Icon className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-mono text-[13px] font-medium">
                            knot.link/spring-sale
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            A short link with a long memory.
                          </p>
                        </div>
                      </div>
                      <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-2 py-1 font-mono text-[9px] tracking-[0.1em] uppercase">
                        <span className="size-1.5 animate-blink rounded-full bg-emerald-500" />
                        Live
                      </span>
                    </div>

                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                          Total clicks
                        </p>
                        <p className="mt-1 text-3xl font-semibold tracking-[-0.04em]">
                          2,481
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 font-mono text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                        ↑ 18.2%
                      </span>
                    </div>

                    <div className="mt-3 h-24">
                      <Sparkline
                        data={chartData}
                        color="green"
                        variant="gradient"
                        bloom="aura"
                        className="h-full w-full"
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-3 font-mono text-[9px] tracking-[0.08em] text-muted-foreground uppercase">
                      <span>Jul 18</span>
                      <span>Jul 20</span>
                      <span>Jul 22</span>
                      <span>Jul 25</span>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-12 -right-3 z-20 w-24 rotate-6 rounded-xl border border-black/10 bg-white p-2.5 text-neutral-950 shadow-xl sm:-top-10 sm:-right-6 sm:w-[8.5rem]">
                  <QrCode
                    value={shortLink ?? "https://knot.link/demo"}
                    className="rounded-[3px]"
                  />
                  <p className="mt-2 text-center font-mono text-[8px] tracking-[0.14em] text-neutral-500 uppercase">
                    Scan me
                  </p>
                </div>

                <div className="absolute -bottom-7 -left-1 z-20 flex items-center gap-2.5 rounded-xl border border-border bg-card py-2.5 pr-3.5 pl-2.5 shadow-xl sm:-left-6">
                  <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <MousePointerClickIcon className="size-4" />
                  </span>
                  <div>
                    <p className="text-[11px] leading-tight font-medium">
                      Click recorded
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground">
                      just now · source: direct
                    </p>
                  </div>
                </div>
              </div>

              <p className="relative z-10 mt-8 text-center font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase lg:text-left">
                A glimpse of the dashboard · example data
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid border-x border-b border-border/70 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((item) => {
            return (
              <div
                key={item.title}
                className="group flex items-start gap-3 border-b border-border/70 px-4 py-5 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0"
              >
                <span className="mt-1 size-2.5 shrink-0 rotate-45 border border-brand/70" />
                <div>
                  <p className="text-[12px] font-medium">{item.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    {item.copy}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
