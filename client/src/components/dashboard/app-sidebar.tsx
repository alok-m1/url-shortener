import { Link, useLocation } from "@tanstack/react-router"
import {
  ArrowUpRightIcon,
  ChartNoAxesColumnIcon,
  Globe2Icon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  Link2Icon,
  QrCodeIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"
import { KnotMark } from "@/components/logo"
import { useDashboardData } from "@/components/dashboard/dashboard-data"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  to: string
  icon: LucideIcon
  count?: boolean
}

const mainNav: NavItem[] = [
  { title: "Overview", to: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Links", to: "/dashboard/links", icon: Link2Icon, count: true },
  {
    title: "Analytics",
    to: "/dashboard/analytics",
    icon: ChartNoAxesColumnIcon,
  },
  {
    title: "QR codes",
    to: "/dashboard/qr-codes",
    icon: QrCodeIcon,
    count: true,
  },
]

const secondaryNav = [
  { title: "Settings", to: "/dashboard/settings", icon: SettingsIcon },
]

const navItemClassName =
  "relative h-9 gap-2.5 rounded-lg pl-2.5 before:absolute before:top-1/2 before:left-0 before:h-3.5 before:w-[2px] before:-translate-y-1/2 before:rounded-full before:bg-brand before:opacity-0 data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-active:before:opacity-100 [&_svg]:text-muted-foreground data-active:[&_svg]:text-foreground"

export function AppSidebar() {
  const { pathname } = useLocation()
  const { urls } = useDashboardData()
  const { isMobile, setOpenMobile } = useSidebar()
  const linkCount = urls.length

  function isActive(to: string) {
    if (to === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(to)
  }

  function closeMobile() {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="[&_[data-slot=sidebar-inner]]:rounded-2xl [&_[data-slot=sidebar-inner]]:border [&_[data-slot=sidebar-inner]]:border-sidebar-border/70 [&_[data-slot=sidebar-inner]]:shadow-[0_24px_60px_-48px_rgba(0,0,0,0.55)]"
    >
      <SidebarHeader className="px-2 pt-3 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="knot."
              render={<Link to="/dashboard" />}
              onClick={closeMobile}
              className="h-11 rounded-xl hover:bg-transparent active:bg-transparent"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-foreground text-background shadow-sm">
                <KnotMark className="size-[19px]" />
              </span>
              <div className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-[15px] font-semibold tracking-[-0.03em]">
                  knot<span className="text-brand">.</span>
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mx-2 h-px bg-sidebar-border/60" />
      </SidebarHeader>

      <SidebarContent className="px-1 pt-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainNav.map((item) => {
                const Icon = item.icon
                const badge = item.count ? linkCount : null
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      isActive={isActive(item.to)}
                      tooltip={item.title}
                      render={<Link to={item.to} />}
                      onClick={closeMobile}
                      className={navItemClassName}
                    >
                      <Icon />
                      <span>{item.title}</span>
                      {badge !== null && badge > 0 ? (
                        <span className="ml-auto rounded-full bg-sidebar-accent px-1.5 py-0.5 font-mono text-[9px] leading-none text-muted-foreground group-data-[collapsible=icon]:hidden">
                          {badge}
                        </span>
                      ) : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[9px] tracking-[0.16em] uppercase">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {secondaryNav.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      isActive={isActive(item.to)}
                      tooltip={item.title}
                      render={<Link to={item.to} />}
                      onClick={closeMobile}
                      className={navItemClassName}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Help & docs"
                  className="h-9 gap-2.5 rounded-lg pl-2.5 [&_svg]:text-muted-foreground"
                  onClick={() =>
                    toast.info("Docs are part of the demo", {
                      description: "This link would open the help center.",
                    })
                  }
                >
                  <LifeBuoyIcon />
                  <span>Help & docs</span>
                  <ArrowUpRightIcon className="ml-auto size-3 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Back to site"
                  render={<Link to="/" />}
                  onClick={closeMobile}
                  className="h-9 gap-2.5 rounded-lg pl-2.5 [&_svg]:text-muted-foreground"
                >
                  <Globe2Icon />
                  <span>Back to site</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
