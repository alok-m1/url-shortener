import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"

import appCss from "../styles.css?url"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||((!t||t==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "knot. — Short links, tied neatly" },
      {
        name: "description",
        content:
          "Short, memorable links with live click analytics, QR codes, custom domains, and team controls.",
      },
      {
        name: "theme-color",
        content: "#f5f4ee",
        media: "(prefers-color-scheme: light)",
      },
      {
        name: "theme-color",
        content: "#101208",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  notFoundComponent: () => (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)] opacity-50"
      />
      <div className="relative z-10">
        <Logo />
      </div>
      <p className="relative z-10 mt-12 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        404 · page not found
      </p>
      <h1 className="relative z-10 mt-3 font-display text-5xl italic sm:text-6xl">
        This link is a loose end.
      </h1>
      <p className="relative z-10 mt-4 max-w-sm text-center text-sm text-muted-foreground">
        The page you're looking for was moved, renamed, or never tied in the
        first place.
      </p>
      <div className="relative z-10 mt-8 flex items-center gap-2">
        <Button
          render={<Link to="/" />}
          nativeButton={false}
          size="lg"
          className="h-10 px-5"
        >
          Back to home
        </Button>
        <ThemeToggle />
      </div>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{ duration: 3200 }}
              />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
