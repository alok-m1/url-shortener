import { createFileRoute } from "@tanstack/react-router"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/auth-forms"

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — knot." },
      {
        name: "description",
        content:
          "Sign in to your knot workspace to manage links and analytics.",
      },
    ],
  }),
  component: LoginPage,
})

function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  )
}
