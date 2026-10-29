import {
  ChartNoAxesColumnIcon,
  Link2Icon,
  SlidersHorizontalIcon,
} from "lucide-react"

const steps = [
  {
    icon: Link2Icon,
    title: "Drop a link",
    description:
      "Paste any URL — long, messy, tracking-heavy, whatever. We'll give it a short, clean home in seconds.",
    detail: "knot.link/launch",
  },
  {
    icon: SlidersHorizontalIcon,
    title: "Make it yours",
    description:
      "Pick a memorable slug, attach your domain, and add a QR code. Set an expiry or password if it needs one.",
    detail: "go.brand.com/launch",
  },
  {
    icon: ChartNoAxesColumnIcon,
    title: "Watch it move",
    description:
      "Clicks appear live — with the source, device, and city behind each one. Share the numbers with your team.",
    detail: "A quieter kind of proof",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border/70 bg-card/25">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid gap-7 lg:grid-cols-[1fr_0.62fr] lg:items-end">
          <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] text-balance sm:text-4xl lg:text-[3.4rem] lg:leading-[0.98]">
            From pasted to{" "}
            <span className="font-display font-normal">published.</span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:justify-self-end">
            No onboarding calls. No dashboards to decode. Just a link with a
            short memory and a long reach.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden border-y border-border/70 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="relative border-b border-border/70 p-5 last:border-b-0 sm:p-6 md:border-r md:border-b-0 md:last:border-r-0"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1.5 pattern-45 text-brand/60"
                />
                <div className="flex items-center gap-3">
                  <Icon className="size-4 text-muted-foreground" />
                  <span className="h-px flex-1 bg-border" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
                  <span className="size-1.5 rotate-45 bg-brand" />
                  {step.detail}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
