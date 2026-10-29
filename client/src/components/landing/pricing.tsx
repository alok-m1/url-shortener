import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { CheckIcon, SparklesIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "cn"

const plans = [
  {
    name: "Starter",
    tagline: "For personal links and side projects.",
    monthly: 0,
    yearly: 0,
    cta: "Start for free",
    features: [
      "100 links per month",
      "Unlimited clicks",
      "Basic click analytics",
      "QR codes & downloads",
      "30-day data history",
    ],
  },
  {
    name: "Pro",
    tagline: "For creators and small teams who ship.",
    monthly: 12,
    yearly: 9,
    cta: "Start 14-day trial",
    featured: true,
    features: [
      "Unlimited links",
      "Advanced analytics & exports",
      "5 custom domains",
      "Password & expiry controls",
      "Link-in-bio pages",
      "API access & webhooks",
    ],
  },
  {
    name: "Business",
    tagline: "For teams that live and breathe links.",
    monthly: 39,
    yearly: 31,
    cta: "Talk to sales",
    features: [
      "Everything in Pro",
      "Unlimited team seats",
      "SSO / SAML & audit logs",
      "Custom roles & permissions",
      "Shared folders & approvals",
      "Priority support with SLA",
    ],
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(true)

  return (
    <section id="pricing" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-52 w-32 pattern-45 [mask-image:linear-gradient(to_bottom,black,transparent)] text-foreground/[0.05]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-7 border-b border-border/70 pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.05em] text-balance sm:text-4xl lg:text-[3.4rem] lg:leading-[0.98]">
            Pricing that stays
            <br />
            <span className="font-display font-normal">out of the way.</span>
          </h2>

          <div className="flex flex-col gap-4 lg:items-end">
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:text-right">
              Start free, stay free if that's all you need. Upgrade when your
              links start doing real work.
            </p>

            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  !yearly
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
              <Switch
                checked={yearly}
                onCheckedChange={setYearly}
                size="sm"
                aria-label="Toggle yearly billing"
                className="mx-0.5"
              />
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  yearly
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Yearly
                <span className="font-mono text-[9px] text-muted-foreground">
                  −25%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly
            return (
              <article
                key={plan.name}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-7",
                  plan.featured
                    ? "border-brand/70 shadow-[0_30px_80px_-50px_var(--brand)]"
                    : "border-border/80"
                )}
              >
                {plan.featured && (
                  <>
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1.5 pattern-45 text-brand/70"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand/12 to-transparent"
                    />
                    <span className="absolute top-4 right-5 inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.08em] text-brand-foreground uppercase shadow-sm">
                      <SparklesIcon className="size-3" />
                      Most popular
                    </span>
                  </>
                )}

                <div className="relative">
                  <h3 className="text-base font-semibold tracking-[-0.01em]">
                    {plan.name}
                  </h3>
                  <p className="mt-1.5 min-h-9 text-[13px] leading-relaxed text-muted-foreground">
                    {plan.tagline}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-4xl font-semibold tracking-[-0.05em]">
                      ${price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <p className="mt-1.5 h-4 font-mono text-[10px] text-muted-foreground">
                    {price > 0 && yearly
                      ? `Billed $${price * 12} once a year`
                      : price === 0
                        ? "Free forever · no card required"
                        : "Billed monthly · cancel anytime"}
                  </p>

                  <Link
                    to="/signup"
                    className={cn(
                      buttonVariants({
                        variant: plan.featured ? "default" : "outline",
                        size: "lg",
                      }),
                      "mt-6 h-10 w-full rounded-xl"
                    )}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="mt-7 space-y-3 border-t border-border/70 pt-6">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-[13px]"
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full",
                            plan.featured
                              ? "bg-brand/30 text-brand-foreground dark:bg-brand/15 dark:text-brand"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <CheckIcon className="size-2.5" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            )
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          All plans include SSL, spam protection, and unlimited clicks.{" "}
          <a
            href="#faq"
            className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
          >
            Questions?
          </a>
        </p>
      </div>
    </section>
  )
}
