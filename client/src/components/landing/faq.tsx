import { ArrowUpRightIcon } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    value: "free",
    question: "Is the free plan actually free?",
    answer:
      "Yes — no trial timer, no credit card, no catch. You get 100 links per month, unlimited clicks, and basic analytics for as long as you like. Upgrade only when you need custom domains, advanced reporting, or team features.",
  },
  {
    value: "domains",
    question: "Can I use my own domain?",
    answer:
      "On Pro and Business, yes. Point a domain or subdomain at Knot and we handle SSL automatically. Most domains verify in under a minute, and existing links keep working while DNS propagates.",
  },
  {
    value: "edit",
    question: "Can I change where a link goes after sharing it?",
    answer:
      "Absolutely. Edit the destination at any time and every printed QR code, social post, and email keeps working. You can also set an expiry date, a password, or a click limit if a link should only live for a while.",
  },
  {
    value: "analytics",
    question: "What do you track, exactly?",
    answer:
      "Clicks, unique visitors, referrers, countries, cities, devices, and browsers. We never sell or share your data, and analytics are aggregated — no invasive fingerprinting, no third-party ad pixels.",
  },
  {
    value: "team",
    question: "How do team workspaces work?",
    answer:
      "Invite teammates by email, group links into shared folders, and assign roles — owner, editor, or viewer. Business plans add SSO/SAML, audit logs, and granular permissions for larger orgs.",
  },
  {
    value: "cancel",
    question: "What happens if I cancel?",
    answer:
      "Your links stay live. Paid features like custom domains and advanced analytics pause at the end of the billing period, and you keep access to everything in the free plan. You can export all of your data at any time.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="border-t border-border/60 bg-card/25">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:py-28">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="max-w-md text-3xl font-semibold tracking-[-0.05em] text-balance sm:text-4xl lg:text-[3.4rem] lg:leading-[0.98]">
            Still <span className="font-display font-normal">curious?</span>
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Everything you're likely to wonder about, answered plainly. Can't
            find it? We reply to every message, usually within a few hours.
          </p>
          <div
            aria-hidden="true"
            className="mt-8 h-28 w-44 pattern-45 text-brand/45"
          />
          <a
            href="mailto:hello@knot.link"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-border underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            Talk to a human
            <ArrowUpRightIcon className="size-3.5" />
          </a>
        </div>

        <Accordion
          multiple={false}
          defaultValue={["free"]}
          className="border-t border-border/70"
        >
          {faqs.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value}>
              <AccordionTrigger className="py-5 text-left text-[15px] font-medium tracking-[-0.01em]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-xl text-[13px] leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
