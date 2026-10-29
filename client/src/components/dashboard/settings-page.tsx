import { useEffect, useState } from "react"
import {
  BadgeCheckIcon,
  BellIcon,
  CalendarDaysIcon,
  CheckIcon,
  Link2Icon,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  Trash2Icon,
  TrophyIcon,
  type LucideIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import { useDashboardData } from "@/components/dashboard/dashboard-data"
import { DitherAvatar } from "@/components/dashboard/dither-avatar"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  AVATAR_COLORS,
  resetAvatarColor,
  setAvatarColor,
  useAvatarColor,
} from "@/lib/avatar-preference"
import { formatDate, splitShortUrl } from "@/lib/format"
import { cn } from "cn"

type ThemeValue = "light" | "dark" | "system"

const themeOptions: {
  value: ThemeValue
  label: string
  icon: typeof SunIcon
}[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
]

function ThemePreview({ mode }: { mode: ThemeValue }) {
  const bars = (
    <>
      <div className="h-1.5 w-5 rounded-full bg-current opacity-70" />
      <div className="mt-1.5 h-1 w-8 rounded-full bg-current opacity-20" />
      <div className="mt-1 h-1 w-6 rounded-full bg-current opacity-20" />
    </>
  )

  if (mode === "system") {
    return (
      <div className="flex h-16 overflow-hidden rounded-lg border border-border/60">
        <div className="flex-1 bg-[#f4f3ec] p-1.5 text-[#191b12]">{bars}</div>
        <div className="flex-1 bg-[#12140c] p-1.5 text-[#f4f3ec]">{bars}</div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "h-16 rounded-lg border border-border/60 p-1.5",
        mode === "light"
          ? "bg-[#f4f3ec] text-[#191b12]"
          : "bg-[#12140c] text-[#f4f3ec]"
      )}
    >
      {bars}
    </div>
  )
}

function SettingSwitch({
  icon: Icon,
  title,
  description,
  defaultChecked = false,
}: {
  icon: LucideIcon
  title: string
  description: string
  defaultChecked?: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <label className="flex cursor-pointer items-center gap-3 py-3.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium">{title}</span>
        <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </label>
  )
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const { urls } = useDashboardData()
  const avatarColor = useAvatarColor()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const displayName = user?.name ?? "Account"
  const email = user?.email ?? ""
  const firstUrl = urls.at(0)
  const shortHost = firstUrl
    ? splitShortUrl(firstUrl.shortUrl, firstUrl.shortCode).host
    : "—"
  const avatarLabel =
    AVATAR_COLORS.find((option) => option.value === avatarColor)?.label ??
    "Acid"

  function chooseAvatarColor(nextColor: (typeof AVATAR_COLORS)[number]) {
    setAvatarColor(nextColor.value)
    toast.success(`${nextColor.label} portrait`, {
      description: "Your dither avatar has a new tint.",
    })
  }

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Your profile, your palette, and the way knot looks while you work."
      >
        <span className="inline-flex h-9 w-fit items-center gap-1.5 rounded-xl border border-border bg-card px-3 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          Connected to the API
        </span>
      </PageHeader>

      <Card className="relative gap-0 overflow-hidden py-0">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 pattern-45 [mask-image:linear-gradient(to_left,black,transparent_92%)] text-foreground/[0.07]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-12 size-56 rounded-full bg-foreground/[0.05] blur-[80px]"
        />

        <div className="relative grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex shrink-0 flex-col items-center gap-2">
              <div className="rounded-[26px] border border-border/70 bg-background/60 p-1.5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.55)]">
                <DitherAvatar
                  name={displayName}
                  color={avatarColor}
                  className="size-24 rounded-[20px] sm:size-28"
                />
              </div>
              <span className="max-w-40 text-center font-mono text-[8px] leading-relaxed tracking-[0.1em] text-muted-foreground uppercase">
                Generated from your name
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-xl font-semibold tracking-[-0.04em]">
                  {displayName}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2 py-0.5 font-mono text-[8px] tracking-[0.08em] text-muted-foreground uppercase">
                  <BadgeCheckIcon className="size-2.5" />
                  Free plan
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {email}
              </p>

              <dl className="mt-4 grid gap-x-5 gap-y-2.5 text-[11px] sm:grid-cols-2">
                <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-1.5">
                  <dt className="text-muted-foreground">Member since</dt>
                  <dd className="font-mono text-[10px]">
                    {user ? formatDate(user.createdAt) : "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-1.5">
                  <dt className="text-muted-foreground">Session</dt>
                  <dd className="font-mono text-[10px]">7 days</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-1.5">
                  <dt className="text-muted-foreground">Workspace</dt>
                  <dd className="text-[10px]">Personal</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-1.5">
                  <dt className="text-muted-foreground">Short host</dt>
                  <dd className="max-w-32 truncate font-mono text-[10px]">
                    {shortHost}
                  </dd>
                </div>
              </dl>

              <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
                Profile details come from your API account. Updates aren't
                exposed by the backend yet.
              </p>
            </div>
          </div>

          <div className="relative rounded-xl border border-border/70 bg-background/60 p-3.5 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-medium">
                  <PaletteIcon className="size-3.5 text-muted-foreground" />
                  Avatar color
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                  Tint the dither portrait. Saved in this browser.
                </p>
              </div>
              <span className="rounded-full border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.08em] text-muted-foreground uppercase">
                {avatarLabel}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {AVATAR_COLORS.map((option) => {
                const active = avatarColor === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => chooseAvatarColor(option)}
                    aria-label={`Use ${option.label} avatar color`}
                    aria-pressed={active}
                    title={option.label}
                    className={cn(
                      "relative rounded-lg border p-1 transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      active
                        ? "border-brand bg-brand/10 ring-2 ring-brand/25"
                        : "border-border/70 hover:-translate-y-0.5 hover:border-foreground/25"
                    )}
                  >
                    <DitherAvatar
                      name={displayName}
                      color={option.value}
                      className="size-7 rounded-[5px]"
                    />
                    {active && (
                      <span className="absolute -top-1 -right-1 grid size-3.5 place-items-center rounded-full bg-brand text-brand-foreground">
                        <CheckIcon className="size-2" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
              <span className="font-mono text-[8px] tracking-[0.1em] text-muted-foreground uppercase">
                Dither palette
              </span>
              <button
                type="button"
                onClick={() => {
                  resetAvatarColor()
                  toast.success("Avatar reset", {
                    description: "Back to the default cobalt tint.",
                  })
                }}
                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcwIcon className="size-3" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="gap-5">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm">
                <SunIcon className="size-3.5 text-muted-foreground" />
                Appearance
              </CardTitle>
              <CardDescription className="text-xs">
                Pick the light your links look best in.
              </CardDescription>
            </div>
            <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[8px] tracking-[0.08em] text-muted-foreground uppercase">
              {mounted ? theme : "system"}
            </span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2.5">
              {themeOptions.map((option) => {
                const Icon = option.icon
                const active = mounted && theme === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    aria-pressed={active}
                    className={cn(
                      "relative rounded-xl border p-2 text-left transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      active
                        ? "border-brand bg-brand/5 ring-2 ring-brand/25"
                        : "border-border hover:border-foreground/25"
                    )}
                  >
                    {active && (
                      <span className="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-brand text-brand-foreground">
                        <CheckIcon className="size-2.5" />
                      </span>
                    )}
                    <ThemePreview mode={option.value} />
                    <span className="mt-2 flex items-center gap-1.5 px-0.5 text-[11px] font-medium">
                      <Icon className="size-3 text-muted-foreground" />
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
              System follows your device setting automatically.
            </p>
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BellIcon className="size-3.5 text-muted-foreground" />
              Notifications
            </CardTitle>
            <CardDescription className="text-xs">
              Preferences are stored in this browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border/70 pt-0">
            <SettingSwitch
              icon={CalendarDaysIcon}
              title="Weekly performance digest"
              description="A Monday summary of clicks, sources, and top links."
              defaultChecked
            />
            <SettingSwitch
              icon={TrophyIcon}
              title="Click milestones"
              description="A nudge when a link passes a round number."
              defaultChecked
            />
            <SettingSwitch
              icon={SparklesIcon}
              title="Product updates"
              description="Occasional notes about new knot features."
            />
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Link2Icon className="size-3.5 text-muted-foreground" />
              Connection
            </CardTitle>
            <CardDescription className="text-xs">
              Where your links come from.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 p-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheckIcon className="size-4" />
                </span>
                <div>
                  <p className="text-[11px] font-medium">API connection</p>
                  <p className="font-mono text-[9px] text-muted-foreground">
                    Live · httpOnly cookie
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[8px] text-emerald-700 dark:text-emerald-400">
                <span className="size-1 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <dl className="space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">Signed in as</dt>
                <dd className="max-w-52 truncate font-mono text-[10px]">
                  {email}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">Short-link host</dt>
                <dd className="max-w-52 truncate font-mono text-[10px]">
                  {shortHost}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Session</dt>
                <dd className="font-mono text-[10px]">7 days</dd>
              </div>
            </dl>

            <p className="text-[10px] leading-relaxed text-muted-foreground">
              Links are created by your API. Custom domains aren't exposed yet.
            </p>
          </CardContent>
        </Card>

        <Card className="gap-4 border-destructive/25">
          <CardHeader>
            <CardTitle className="text-sm text-destructive">
              Danger zone
            </CardTitle>
            <CardDescription className="text-xs">
              Irreversible actions for this account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[13px] font-medium">Delete account</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                  Account deletion isn't exposed by the API yet. Every link and
                  click is kept safe.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 shrink-0 gap-1.5"
                onClick={() =>
                  toast.error("Account deletion is not available", {
                    description:
                      "The backend doesn't expose this endpoint yet.",
                  })
                }
              >
                <Trash2Icon className="size-3.5" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
