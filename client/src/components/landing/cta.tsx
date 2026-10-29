import { Link } from "@tanstack/react-router"
import { ArrowRightIcon, CalendarIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export function CallToAction() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
      <div className="relative overflow-hidden rounded-2xl bg-brand text-brand-foreground">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-[55%] pattern-45-bold [mask-image:linear-gradient(to_left,black,transparent_92%)] text-brand-foreground/15"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-36 -left-20 size-80 rotate-45 border border-brand-foreground/15"
        />
        <div
          aria-hidden="true"
          className="absolute -top-40 right-10 size-72 rotate-12 border border-brand-foreground/15"
        />

        <div className="relative grid gap-8 p-7 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end lg:p-16">
          <div>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.05em] text-balance sm:text-5xl sm:leading-[0.98]">
              Ready to tie things{" "}
              <span className="font-display font-normal">up?</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed opacity-70">
              Start free in seconds. Upgrade when your links start working
              harder than you do.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <Link
              to="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 rounded-xl border-transparent bg-brand-foreground px-6 text-brand shadow-lg hover:bg-brand-foreground/90"
              )}
            >
              Start for free
              <ArrowRightIcon className="size-4" />
            </Link>
            <a
              href="mailto:hello@knot.link"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 gap-2 rounded-xl border-brand-foreground/25 bg-transparent px-6 text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
              )}
            >
              <CalendarIcon className="size-4" />
              Book a demo
            </a>
            <p className="mt-1 text-center font-mono text-[9px] tracking-[0.08em] uppercase opacity-50">
              No card · cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
