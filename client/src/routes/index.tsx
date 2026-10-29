import { createFileRoute } from "@tanstack/react-router"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/landing/hero"
import { Manifesto, MarqueeStrip } from "@/components/landing/trust"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Pricing } from "@/components/landing/pricing"
import { Faq } from "@/components/landing/faq"
import { CallToAction } from "@/components/landing/cta"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "knot. — Short links, tied neatly" },
      {
        name: "description",
        content:
          "Knot turns long, unwieldy URLs into short, memorable links with live click analytics, QR codes, custom domains, and team controls.",
      },
    ],
  }),
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-svh">
      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <MarqueeStrip />
        <Features />
        <Manifesto />
        <HowItWorks />
        <Pricing />
        <Faq />
        <CallToAction />
      </main>
      <SiteFooter />
    </div>
  )
}
