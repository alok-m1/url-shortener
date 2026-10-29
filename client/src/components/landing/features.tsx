import { Link } from "@tanstack/react-router"
import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  Globe2Icon,
  LineChartIcon,
  LockIcon,
  QrCodeIcon,
  TerminalIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Sparkline } from "@/components/dither-kit/sparkline"
import { QrCode } from "@/components/qr-code"

const apiSnippet = `POST /v1/links

{
  "url": "studioframe.co/summer",
  "slug": "summer"
}`

export function Features() {
  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(apiSnippet)
      toast.success("API sample copied")
    } catch {
      toast.error("Could not copy the sample")
    }
  }

  return (
    <section
      id="features"
      className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="grid gap-7 border-b border-border/70 pb-9 lg:grid-cols-[1fr_0.62fr] lg:items-end">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.05em] text-balance sm:text-4xl lg:text-[3.5rem] lg:leading-[0.98]">
          One link.
          <br />
          <span className="font-display font-normal">Then another.</span>
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:justify-self-end">
          Every knot gets the same care: a short address, a clear read on what
          happened, and a way to make it yours.
        </p>
      </div>

      <div className="flex flex-col gap-20 lg:gap-28">
        <article className="grid gap-9 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
          <div>
            <span className="block h-px w-10 bg-brand" />
            <h3 className="mt-5 max-w-md text-2xl font-semibold tracking-[-0.04em] text-balance sm:text-[1.85rem]">
              Know what happened after the click.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Sources, devices, cities, and the quiet hours in between. Filter
              by date, export the lot, or pull it straight from the API.
            </p>
            <Link
              to="/dashboard/analytics"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-border underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              Open analytics in the demo
              <ArrowUpRightIcon className="size-3.5" />
            </Link>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -top-4 -right-4 h-28 w-28 pattern-45 text-brand/30"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -left-5 h-24 w-24 pattern-45 text-foreground/[0.07]"
            />
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card">
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
                    Example dashboard
                  </p>
                  <p className="mt-0.5 text-[13px] font-medium">
                    Clicks · last 30 days
                  </p>
                </div>
                <span className="rounded-full border border-border bg-background px-2 py-1 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                  Sample data
                </span>
              </div>

              <div className="px-4 pt-4 pb-2">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-semibold tracking-[-0.04em]">
                    61,080{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      clicks
                    </span>
                  </p>
                  <span className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground">
                    <LineChartIcon className="size-3" />
                    Mobile + desktop
                  </span>
                </div>
                <div className="mt-3 h-44">
                  <Sparkline
                    data={[
                      980, 1120, 1040, 1240, 1180, 1420, 1320, 1560, 1480, 1720,
                      1640, 1880, 1760, 2010, 1920, 2180, 2060, 2340, 2240,
                      2480, 2380, 2620, 2520, 2760, 2640, 2880, 2790, 2960,
                      2840, 3120,
                    ]}
                    color="green"
                    variant="gradient"
                    bloom="aura"
                    className="h-full w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 border-t border-border/70">
                {["Direct", "Social", "Search"].map((source, index) => (
                  <div
                    key={source}
                    className="border-r border-border/70 px-3 py-2.5 last:border-r-0"
                  >
                    <p className="font-mono text-[8px] tracking-[0.1em] text-muted-foreground uppercase">
                      {index === 0
                        ? "Top source"
                        : index === 1
                          ? "Referrers"
                          : "Places"}
                    </p>
                    <p className="mt-1 text-[11px]">{source}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="grid gap-9 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <span className="block h-px w-10 bg-brand" />
            <h3 className="mt-5 max-w-md text-2xl font-semibold tracking-[-0.04em] text-balance sm:text-[1.85rem]">
              Make the link sound like you.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Put your domain on every click, choose a slug you can say out
              loud, and give the printed version the same attention as the
              digital one.
            </p>
            <Link
              to="/dashboard/qr-codes"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-border underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              Explore QR codes in the demo
              <ArrowUpRightIcon className="size-3.5" />
            </Link>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute top-4 -right-5 h-44 w-28 pattern-45 text-foreground/[0.07]"
            />
            <div className="relative rounded-2xl border border-border/80 bg-card p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
                  Branded link
                </p>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] text-emerald-700 dark:text-emerald-400">
                  <CheckIcon className="size-3" />
                  Live
                </span>
              </div>

              <div className="mt-3 rounded-xl border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <LockIcon className="size-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate font-mono text-[12px]">
                    go.studioframe.co/fw26
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Custom domain", "Auto SSL", "Password ready"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[9px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 rounded-xl border border-border/70 bg-muted/30 p-3">
                <div className="shrink-0 rounded-lg border border-black/10 bg-white p-1.5 text-neutral-950">
                  <QrCode
                    value="https://go.studioframe.co/fw26"
                    className="size-16"
                  />
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-[12px] font-medium">
                    <QrCodeIcon className="size-3.5" />
                    The printed twin
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    Every link gets a downloadable QR code. Change the
                    destination without reprinting.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-border/70 pt-3 font-mono text-[9px] text-muted-foreground">
                <Globe2Icon className="size-3" />
                One domain, every campaign.
              </div>
            </div>
          </div>
        </article>

        <article className="grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <span className="block h-px w-10 bg-brand" />
            <h3 className="mt-5 max-w-md text-2xl font-semibold tracking-[-0.04em] text-balance sm:text-[1.85rem]">
              Built to be built on.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Create links from your deploy, your CMS, or a Sunday-morning
              script. A small API, useful webhooks, and no ceremony.
            </p>
            <a
              href="mailto:hello@knot.link"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-border underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              Talk to us about access
              <ArrowUpRightIcon className="size-3.5" />
            </a>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -right-4 -bottom-4 h-24 w-24 pattern-45 text-brand/25"
            />
            <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#101208] text-[#e8e6dc]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.12em] text-white/45 uppercase">
                  <TerminalIcon className="size-3" />
                  REST API
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-7 text-white/50 hover:bg-white/10 hover:text-white"
                  onClick={copySnippet}
                  aria-label="Copy API sample"
                >
                  <CopyIcon className="size-3.5" />
                </Button>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-[#c9c7bc]">
                <code>
                  <span className="text-[#c8f169]">POST</span>{" "}
                  <span className="text-white/80">/v1/links</span>
                  {"\n\n"}
                  <span className="text-white/35">{"{"}</span>
                  {"\n  "}
                  <span className="text-[#9ecbff]">"url"</span>
                  <span className="text-white/35">: </span>
                  <span className="text-[#c8f169]">
                    "studioframe.co/summer"
                  </span>
                  <span className="text-white/35">,</span>
                  {"\n  "}
                  <span className="text-[#9ecbff]">"slug"</span>
                  <span className="text-white/35">: </span>
                  <span className="text-[#c8f169]">"summer"</span>
                  {"\n"}
                  <span className="text-white/35">{"}"}</span>
                </code>
              </pre>
              <div className="border-t border-white/10 px-4 py-2.5 font-mono text-[9px] text-white/35">
                Copy, paste, ship.
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
