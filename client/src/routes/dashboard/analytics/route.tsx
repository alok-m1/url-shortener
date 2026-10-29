import { createFileRoute } from "@tanstack/react-router"
import { AnalyticsPage } from "@/components/dashboard/analytics-page"

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({
    meta: [{ title: "Analytics — knot." }],
  }),
  component: AnalyticsPage,
})
