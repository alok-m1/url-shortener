import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import {
  BadgeCheckIcon,
  BellIcon,
  ChartNoAxesColumnIcon,
  ChevronDownIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  Link2Icon,
  LogOutIcon,
  QrCodeIcon,
  RefreshCwIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import { useAvatarColor } from "@/lib/avatar-preference"
import { DitherAvatar } from "@/components/dashboard/dither-avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { CommandSearch } from "@/components/dashboard/command-search"
import { useDashboardData } from "@/components/dashboard/dashboard-data"

const pageMeta: Record<string, { name: string; icon: LucideIcon }> = {
  "": { name: "Overview", icon: LayoutDashboardIcon },
  links: { name: "Links", icon: Link2Icon },
  analytics: { name: "Analytics", icon: ChartNoAxesColumnIcon },
  "qr-codes": { name: "QR codes", icon: QrCodeIcon },
  settings: { name: "Settings", icon: SettingsIcon },
}

export function DashboardHeader() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { refresh } = useDashboardData()
  const avatarColor = useAvatarColor()
  const [refreshing, setRefreshing] = useState(false)
  const segment =
    pathname.replace("/dashboard", "").split("/").filter(Boolean)[0] ?? ""
  const page = pageMeta[segment] ?? pageMeta[""]
  const PageIcon = page.icon
  const displayName = user?.name ?? "Account"
  const email = user?.email ?? ""

  async function handleRefresh() {
    setRefreshing(true)
    await refresh({ silent: true })
    setRefreshing(false)
    toast.success("Workspace refreshed", {
      description: "Your links and click counts are up to date.",
    })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-3 sm:px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 text-muted-foreground" />
        <Separator orientation="vertical" className="mx-0.5 h-5" />

        <div className="flex min-w-0 items-center gap-2.5">
          <span className="hidden size-7 place-items-center rounded-lg border border-border/70 bg-card text-muted-foreground sm:grid">
            <PageIcon className="size-3.5" />
          </span>
          <div className="hidden min-w-0 leading-tight sm:block">
            <p className="font-mono text-[8px] tracking-[0.16em] text-muted-foreground uppercase">
              Workspace
            </p>
            <p className="truncate text-[13px] font-medium">{page.name}</p>
          </div>
          <span className="truncate text-sm font-medium sm:hidden">
            {page.name}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <CommandSearch className="h-9 w-9 justify-center border-transparent bg-transparent px-0 text-muted-foreground shadow-none hover:border-border hover:bg-muted sm:w-52 sm:justify-start sm:border-input sm:bg-transparent sm:px-2.5 lg:w-60" />

          <div className="hidden items-center gap-0.5 rounded-xl border border-border/60 bg-card/70 p-1 sm:flex">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label="Refresh data"
              title="Refresh data"
              disabled={refreshing}
              onClick={() => void handleRefresh()}
            >
              <RefreshCwIcon
                className={refreshing ? "size-3.5 animate-spin" : "size-3.5"}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative text-muted-foreground"
              aria-label="Notifications"
              onClick={() =>
                toast.success("You're all caught up", {
                  description: "No new notifications right now.",
                })
              }
            >
              <BellIcon className="size-3.5" />
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-brand ring-2 ring-card" />
            </Button>
            <ThemeToggle className="size-7 text-muted-foreground" />
          </div>

          <ThemeToggle className="text-muted-foreground sm:hidden" />

          <Separator
            orientation="vertical"
            className="mx-0.5 hidden h-6 sm:block"
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="h-10 gap-2 rounded-xl px-1.5 hover:border-border/70 hover:bg-card lg:border lg:border-border/60 lg:bg-card/70 lg:pr-2 lg:pl-1.5"
                  aria-label="Account menu"
                />
              }
            >
              <DitherAvatar
                name={displayName}
                color={avatarColor}
                className="size-8 rounded-full ring-1 ring-foreground/10"
              />
              <span className="hidden min-w-0 text-left leading-tight lg:grid">
                <span className="max-w-32 truncate text-xs font-medium">
                  {displayName}
                </span>
                <span className="max-w-32 truncate font-mono text-[8px] tracking-[0.06em] text-muted-foreground uppercase">
                  Free plan
                </span>
              </span>
              <ChevronDownIcon className="hidden size-3 text-muted-foreground lg:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64" sideOffset={8}>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2.5">
                    <DitherAvatar
                      name={displayName}
                      color={avatarColor}
                      className="size-10 shrink-0 rounded-xl ring-1 ring-foreground/10"
                    />
                    <div className="grid min-w-0 leading-tight">
                      <span className="truncate text-sm font-medium">
                        {displayName}
                      </span>
                      <span className="truncate text-[10px] text-muted-foreground">
                        {email}
                      </span>
                      <span className="mt-1 flex w-fit items-center gap-1 rounded-full bg-muted/70 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.08em] text-muted-foreground uppercase">
                        <span className="size-1 rounded-full bg-foreground/50" />
                        Free plan
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={<Link to="/dashboard/settings" />}
                  className="gap-2"
                >
                  <SettingsIcon />
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() =>
                    toast.info("Billing is part of the demo", {
                      description: "No invoices to worry about here.",
                    })
                  }
                >
                  <CreditCardIcon />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() =>
                    toast.info("Upgrade is part of the demo", {
                      description: "No payment details needed here.",
                    })
                  }
                >
                  <BadgeCheckIcon />
                  Upgrade plan
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() =>
                    toast.success("You're all caught up", {
                      description: "No new notifications right now.",
                    })
                  }
                >
                  <BellIcon />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="gap-2"
                onClick={async () => {
                  await logout()
                  navigate({ to: "/login" })
                  toast.success("Signed out")
                }}
              >
                <LogOutIcon />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
