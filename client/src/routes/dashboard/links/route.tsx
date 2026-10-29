import { createFileRoute } from "@tanstack/react-router"
import { LinksPage } from "@/components/dashboard/links-page"

export const Route = createFileRoute("/dashboard/links")({
  head: () => ({
    meta: [{ title: "Links — knot." }],
  }),
  component: LinksPage,
})
