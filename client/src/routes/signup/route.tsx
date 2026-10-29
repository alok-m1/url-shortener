import { createFileRoute } from "@tanstack/react-router"
import { AuthShell } from "@/components/auth/auth-shell"
import { SignupForm } from "@/components/auth/auth-forms"

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — knot." },
      {
        name: "description",
        content:
          "Create a free knot account. Short links, QR codes, and live analytics in seconds.",
      },
    ],
  }),
  component: SignupPage,
})

function SignupPage() {
  return (
    <AuthShell>
      <SignupForm />
    </AuthShell>
  )
}
