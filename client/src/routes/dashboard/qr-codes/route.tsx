import { createFileRoute } from "@tanstack/react-router"
import { QrCodesPage } from "@/components/dashboard/qr-codes-page"

export const Route = createFileRoute("/dashboard/qr-codes")({
  head: () => ({
    meta: [{ title: "QR codes — knot." }],
  }),
  component: QrCodesPage,
})
