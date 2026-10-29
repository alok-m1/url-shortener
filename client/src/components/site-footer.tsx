import { Link } from "@tanstack/react-router"
import { Logo } from "@/components/logo"

function XIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 2H22l-6.77 7.74L23 22h-6.2l-4.86-6.36L6.36 22H3.2l7.24-8.28L1.5 2h6.36l4.4 5.82L18.9 2Zm-1.1 18h1.72L7.36 3.9H5.52L17.8 20Z" />
    </svg>
  )
}

function GithubIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 1.8a10.2 10.2 0 0 0-3.23 19.88c.51.1.7-.22.7-.49v-1.9c-2.84.62-3.44-1.21-3.44-1.21-.46-1.18-1.13-1.5-1.13-1.5-.93-.63.07-.62.07-.62 1.03.07 1.57 1.05 1.57 1.05.9 1.56 2.38 1.11 2.96.85.09-.66.35-1.11.64-1.37-2.27-.26-4.65-1.13-4.65-5.04 0-1.11.4-2.02 1.05-2.73-.11-.26-.46-1.3.1-2.7 0 0 .85-.27 2.8 1.04a9.76 9.76 0 0 1 5.1 0c1.94-1.31 2.79-1.04 2.79-1.04.56 1.4.21 2.44.1 2.7.65.71 1.04 1.62 1.04 2.73 0 3.92-2.39 4.78-4.66 5.03.36.31.68.93.68 1.87v2.77c0 .27.19.6.71.5A10.2 10.2 0 0 0 12 1.8Z" />
    </svg>
  )
}

function LinkedinIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45Z" />
    </svg>
  )
}

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

const socials = [
  { label: "X", Icon: XIcon },
  { label: "GitHub", Icon: GithubIcon },
  { label: "LinkedIn", Icon: LinkedinIcon },
]

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border/70">
      <div className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Logo />
            <p className="mt-7 font-display text-4xl leading-[1.02] text-balance sm:text-5xl">
              Make the link.
              <br />
              Keep the story.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Short links with a long memory — built for the people who care
              where the link actually goes.
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:items-end">
            <nav
              aria-label="Footer"
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm lg:justify-end"
            >
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/login"
                className="rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-sm font-medium text-foreground underline decoration-brand decoration-2 underline-offset-4 transition-colors outline-none hover:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Start free
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors outline-none hover:border-foreground/30 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <social.Icon className="size-3.5" />
                </a>
              ))}
            </div>

            <a
              href="mailto:hello@knot.link"
              className="rounded-sm font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              hello@knot.link
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/70 py-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Knot Labs, Inc.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="#"
              className="rounded-sm transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Privacy
            </a>
            <a
              href="#"
              className="rounded-sm transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Terms
            </a>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rotate-45 bg-brand" />
              Made for the open web
            </span>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative mt-6 border-t border-border/60"
      >
        <div className="pointer-events-none absolute inset-0 pattern-45 text-foreground/[0.045]" />
        <div className="relative mx-auto w-full max-w-7xl overflow-hidden px-5 sm:px-8">
          <p className="-mb-[0.06em] font-display text-[clamp(5.5rem,24vw,21rem)] leading-[0.72] tracking-[-0.04em] text-foreground/10 select-none">
            knot.
          </p>
        </div>
      </div>
    </footer>
  )
}
