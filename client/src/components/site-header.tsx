import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowUpRightIcon, MenuIcon } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "cn"

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full pt-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background px-3 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_10px_30px_-18px_rgba(0,0,0,0.35)]">
          <Logo className="pl-1" />

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border border-border/60 bg-card p-1 text-[13px] shadow-sm lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            {user ? (
              <Link
                to="/dashboard"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "hidden h-8 gap-1.5 rounded-full px-3.5 sm:inline-flex"
                )}
              >
                Dashboard
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "hidden text-muted-foreground hover:text-foreground sm:inline-flex"
                  )}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "hidden h-8 gap-1.5 rounded-full px-3.5 sm:inline-flex"
                  )}
                >
                  Start for free
                  <ArrowUpRightIcon className="size-3.5" />
                </Link>
              </>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open navigation menu"
                  >
                    <MenuIcon className="size-5" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-[88%] max-w-sm p-0">
                <SheetHeader className="border-b px-5 py-4">
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Site navigation and account links
                  </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4 py-4">
                  {links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-3 text-[15px] font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-2 border-t p-4">
                  {user ? (
                    <>
                      <p className="pb-1 text-center text-xs text-muted-foreground">
                        Signed in as {user.email}
                      </p>
                      <Link
                        to="/dashboard"
                        onClick={() => setOpen(false)}
                        className={cn(buttonVariants({ size: "lg" }), "h-10")}
                      >
                        Open dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "lg" }),
                          "h-10"
                        )}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setOpen(false)}
                        className={cn(buttonVariants({ size: "lg" }), "h-10")}
                      >
                        Start for free
                      </Link>
                      <p className="pt-2 text-center text-xs text-muted-foreground">
                        Free forever · No credit card required
                      </p>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
