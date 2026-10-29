import { useEffect, useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { cn } from "cn"
import { useAuth } from "@/components/auth/auth-provider"
import { getApiErrorMessage } from "@/lib/api"

function PasswordInput({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-10 rounded-xl pr-10"
        required
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground"
      >
        {visible ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </button>
    </div>
  )
}

export function LoginForm() {
  const navigate = useNavigate()
  const { login, user, loading: authLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/dashboard", replace: true })
    }
  }, [authLoading, navigate, user])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
      toast.success("Welcome back", {
        description: "Signed in to your knot workspace.",
      })
      navigate({ to: "/dashboard" })
    } catch (error) {
      toast.error("Could not sign in", {
        description: getApiErrorMessage(error),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div>
        <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          Welcome back
        </p>
        <h1 className="mt-3 text-[1.9rem] leading-[1.1] font-semibold tracking-[-0.04em]">
          Sign in to{" "}
          <span className="font-display font-normal italic">knot.</span>
        </h1>
        <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
          Good to see you again. Your links have been busy.
        </p>
      </div>

      <form className="mt-7" onSubmit={handleSubmit}>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@studio.com"
              autoComplete="email"
              className="h-10 rounded-xl"
              required
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <a
                href="mailto:hello@knot.link?subject=Password%20help"
                className="text-[11px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Need help?
              </a>
            </div>
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
          </Field>

          <p className="text-[10px] text-muted-foreground">
            Sessions last 7 days on this device.
          </p>

          <Button
            type="submit"
            size="lg"
            className="mt-1 h-10 w-full gap-2 rounded-xl"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        New to knot?{" "}
        <Link
          to="/signup"
          className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
        >
          Create an account
        </Link>
      </p>

      <p className="mt-8 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/70">
        <LockIcon className="size-3" />
        Protected with 256-bit encryption
      </p>
    </div>
  )
}

const strengthLabels = ["Too short", "Weak", "Fair", "Good", "Strong"]

function passwordScore(password: string) {
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1
  return Math.min(score, 4)
}

export function SignupForm() {
  const navigate = useNavigate()
  const { register, user, loading: authLoading } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const score = passwordScore(password)

  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/dashboard", replace: true })
    }
  }, [authLoading, navigate, user])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!terms) {
      toast.error("Please accept the terms to continue")
      return
    }
    setLoading(true)
    try {
      await register({ name, email, password })
      toast.success("Account created", {
        description: "Welcome to knot — let's tie some links.",
      })
      navigate({ to: "/dashboard" })
    } catch (error) {
      toast.error("Could not create your account", {
        description: getApiErrorMessage(error),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div>
        <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          Get started
        </p>
        <h1 className="mt-3 text-[1.9rem] leading-[1.1] font-semibold tracking-[-0.04em]">
          Tie your first{" "}
          <span className="font-display font-normal italic">knot.</span>
        </h1>
        <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
          Free forever. No credit card. Your links will thank you.
        </p>
      </div>

      <form className="mt-7" onSubmit={handleSubmit}>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Alex Rivera"
              autoComplete="name"
              className="h-10 rounded-xl"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-email">Work email</FieldLabel>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@studio.com"
              autoComplete="email"
              className="h-10 rounded-xl"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-password">Password</FieldLabel>
            <PasswordInput
              id="signup-password"
              value={password}
              onChange={setPassword}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            {password.length > 0 ? (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <span
                      key={index}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        index < score
                          ? score <= 1
                            ? "bg-destructive"
                            : score === 2
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="w-14 text-right font-mono text-[9px] text-muted-foreground">
                  {strengthLabels[score]}
                </span>
              </div>
            ) : (
              <FieldDescription>
                Use 8+ characters with a mix of letters and numbers.
              </FieldDescription>
            )}
          </Field>

          <label className="flex cursor-pointer items-start gap-2.5 text-[11px] leading-relaxed text-muted-foreground">
            <Checkbox
              checked={terms}
              onCheckedChange={(checked) => setTerms(checked)}
              className="mt-0.5"
            />
            <span>
              I agree to the{" "}
              <a
                href="#"
                className="text-foreground underline underline-offset-2"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-foreground underline underline-offset-2"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <Button
            type="submit"
            size="lg"
            className="mt-1 h-10 w-full gap-2 rounded-xl"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Creating account…
              </>
            ) : (
              <>
                Create free account
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
        >
          Sign in
        </Link>
      </p>

      <p className="mt-8 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/70">
        <LockIcon className="size-3" />
        Protected with 256-bit encryption
      </p>
    </div>
  )
}
