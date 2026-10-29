import type { ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { QrCode } from "@/components/qr-code"
import { Sparkline } from "@/components/dither-kit/sparkline"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.02fr]">
      <div className="flex min-h-svh flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link
              to="/"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden gap-1.5 text-muted-foreground sm:inline-flex"
              )}
            >
              <ArrowLeftIcon className="size-3.5" />
              Back to site
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[23rem]">{children}</div>
        </main>

        <footer className="flex flex-col items-center gap-2 text-center text-[11px] text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Knot Labs, Inc.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Help
            </a>
          </div>
        </footer>
      </div>

      <AuthPanel />
    </div>
  )
}

function AuthPanel() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden border-l border-black/10 bg-[#101208] p-10 text-[#f4f3ec] lg:flex xl:p-14">
      <div className="grain-overlay" />
      <div
        aria-hidden="true"
        className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)] [background-size:22px_22px] opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 size-[26rem] rounded-full bg-brand/20 blur-[110px]"
      />

      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.18em] text-white/35 uppercase">
          The quiet link manager
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] text-white/60 uppercase">
          <span className="size-1.5 animate-blink rounded-full bg-brand" />
          All systems go
        </span>
      </div>

      <div className="relative z-10 my-12 max-w-md">
        <h2 className="font-display text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.02] text-balance italic">
          Short links.
          <br />
          <span className="text-brand">Quietly powerful.</span>
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/45">
          One calm home for every link you share — with the numbers to back it
          up.
        </p>

        <div className="relative mt-10 max-w-[22rem]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-brand/15 text-brand">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 8.25A3.75 3.75 0 0 1 10.75 4.5h2.5A3.75 3.75 0 0 1 17 8.25 3.75 3.75 0 0 1 13.25 12h-2.5A3.75 3.75 0 0 0 7 15.75a3.75 3.75 0 0 0 3.75 3.75h2.5A3.75 3.75 0 0 0 17 15.75"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="font-mono text-[12px]">knot.link/summer-26</p>
                  <p className="text-[10px] text-white/35">
                    2,481 clicks today
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[8px] tracking-[0.1em] text-white/45 uppercase">
                Live
              </span>
            </div>

            <div className="mt-5 h-20">
              <Sparkline
                data={[12, 20, 16, 28, 24, 38, 30, 46, 41, 56, 50, 68]}
                color="green"
                variant="gradient"
                bloom="aura"
                animate
                className="h-full w-full"
              />
            </div>

            <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="font-mono text-[9px] tracking-[0.1em] text-white/35 uppercase">
                Last 24 hours
              </span>
              <span className="font-mono text-[9px] text-brand">↑ 18.2%</span>
            </div>
          </div>

          <div className="absolute -right-4 -bottom-8 w-24 rotate-6 animate-float-slow rounded-xl bg-white p-2 text-neutral-950 shadow-2xl">
            <QrCode value="https://knot.link/demo" className="rounded-[2px]" />
            <p className="mt-1.5 text-center font-mono text-[7px] tracking-[0.12em] text-neutral-500 uppercase">
              Scan
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 pt-6">
        <blockquote className="text-[13px] leading-relaxed text-white/60">
          “The best link tool we've used — and the only one our whole team
          actually opens.”
        </blockquote>
        <div className="mt-3 flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-full bg-brand/90 text-[9px] font-semibold text-brand-foreground">
            AO
          </span>
          <p className="text-[11px] text-white/40">
            <span className="text-white/70">Amara Okafor</span> · Head of
            Growth, Studioframe
          </p>
        </div>
      </div>
    </aside>
  )
}
