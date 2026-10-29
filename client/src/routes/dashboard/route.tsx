import { useEffect } from "react"
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardDataProvider } from "@/components/dashboard/dashboard-data"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/components/auth/auth-provider"
import { Logo } from "@/components/logo"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — knot." }],
  }),
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login", replace: true })
    }
  }, [loading, navigate, user])

  if (loading || !user) {
    return (
      <div className="grid min-h-svh place-items-center">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <span className="font-mono text-[9px] tracking-[0.16em] text-muted-foreground uppercase">
            Checking your session…
          </span>
        </div>
      </div>
    )
  }

  return (
    <DashboardDataProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="relative overflow-x-clip bg-background">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-30"
          />
          <DashboardHeader />
          <div className="relative flex flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex w-full max-w-[1560px] flex-1 flex-col gap-5 lg:gap-6">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardDataProvider>
  )
}
