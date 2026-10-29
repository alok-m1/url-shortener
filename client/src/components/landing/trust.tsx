const marqueeItems = [
  "Short links",
  "Custom domains",
  "QR codes",
  "Live analytics",
  "API access",
  "Team workspaces",
  "Link-in-bio",
]

const principles = [
  {
    title: "Fast",
    copy: "Short links that resolve before the coffee cools.",
  },
  {
    title: "Legible",
    copy: "Numbers that read like a sentence, not a spreadsheet.",
  },
  {
    title: "Yours",
    copy: "Your domain, your slug, your rules.",
  },
]

export function MarqueeStrip() {
  return (
    <section
      aria-label="What knot does"
      className="group relative overflow-hidden border-b border-border/70 bg-foreground text-background"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 pattern-45 text-brand/25"
      />
      <div className="relative flex overflow-hidden" aria-hidden="true">
        <div className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex items-center gap-6 px-4 py-3.5 whitespace-nowrap"
            >
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase">
                {item}
              </span>
              <span className="h-3 w-px rotate-45 bg-brand" />
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">{marqueeItems.join(", ")}.</p>
    </section>
  )
}

export function Manifesto() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#101208] text-[#f4f3ec]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-[55%] pattern-45 [mask-image:linear-gradient(to_left,black,transparent_94%)] text-brand/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-0 size-[28rem] rounded-full bg-brand/20 blur-[120px]"
        />

        <div className="relative grid gap-12 p-7 sm:p-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:p-16">
          <div>
            <span className="block h-px w-16 bg-brand" />
            <h2 className="mt-7 max-w-2xl font-display text-[clamp(2.5rem,5.3vw,4.7rem)] leading-[0.98] text-balance">
              A link is a <span className="text-brand">promise.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/55">
              It should open in a blink, look like you made it, and tell you
              something useful when it lands. That's the whole product. The rest
              is tooling.
            </p>
          </div>

          <div className="lg:self-end lg:justify-self-end lg:pb-1">
            <ul className="w-full border-t border-white/10 lg:min-w-[19rem]">
              {principles.map((principle) => (
                <li
                  key={principle.title}
                  className="flex gap-4 border-b border-white/10 py-4 last:border-b-0"
                >
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rotate-45 border border-brand/70" />
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.14em] text-brand uppercase">
                      {principle.title}
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-white/50">
                      {principle.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Quote() {
  return <Manifesto />
}
