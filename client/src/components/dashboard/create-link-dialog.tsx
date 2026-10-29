import { useState } from "react"
import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  Link2Icon,
  Loader2Icon,
  PlusIcon,
  QrCodeIcon,
} from "lucide-react"
import { toast } from "sonner"
import { useDashboardData } from "@/components/dashboard/dashboard-data"
import { getApiErrorMessage, type ApiUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { QrCode } from "@/components/qr-code"
import { cn } from "cn"

export function CreateLinkDialog({
  className,
  label = "Create link",
}: {
  className?: string
  label?: string
}) {
  const { createUrl } = useDashboardData()
  const [open, setOpen] = useState(false)
  const [destination, setDestination] = useState("")
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<ApiUrl | null>(null)

  function reset() {
    setDestination("")
    setCreated(null)
    setLoading(false)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      window.setTimeout(reset, 200)
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!destination.trim()) return

    setLoading(true)
    try {
      const link = await createUrl(destination.trim())
      setCreated(link)
      toast.success("Short link created", {
        description: link.shortUrl,
      })
    } catch (error) {
      toast.error("Could not create the link", {
        description: getApiErrorMessage(error),
      })
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    if (!created) return
    try {
      await navigator.clipboard.writeText(created.shortUrl)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Could not copy the link")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className={cn("h-9 gap-1.5 rounded-lg px-3.5", className)}>
            <PlusIcon className="size-4" />
            {label}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        {created ? (
          <>
            <DialogHeader>
              <span className="grid size-10 place-items-center rounded-full bg-brand/25 text-brand-foreground dark:bg-brand/15 dark:text-brand">
                <CheckIcon className="size-5" />
              </span>
              <DialogTitle>Your link is live</DialogTitle>
              <DialogDescription>
                Share it anywhere — every click will show up in your dashboard.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-3 rounded-xl border border-brand/40 bg-brand/10 p-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-brand-foreground">
                <Link2Icon className="size-4" />
              </span>
              <span className="truncate font-mono text-sm font-medium">
                {created.shortUrl}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="ml-auto shrink-0"
                onClick={copyLink}
                aria-label="Copy short link"
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
              <div className="size-16 shrink-0 overflow-hidden rounded-md bg-white p-1.5 text-neutral-950">
                <QrCode value={created.shortUrl} label={created.shortCode} />
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-medium">
                  <QrCodeIcon className="size-3.5" />
                  QR code generated
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Download a print-ready code from the QR codes page.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <DialogClose
                render={<Button variant="outline" className="h-9" />}
              >
                Done
              </DialogClose>
              <Button
                className="h-9 gap-1.5"
                onClick={() => {
                  setCreated(null)
                  setDestination("")
                }}
              >
                Create another
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create a short link</DialogTitle>
              <DialogDescription>
                Paste a destination and we'll generate a short code for you.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="destination">Destination URL</FieldLabel>
                  <Input
                    id="destination"
                    type="url"
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                    placeholder="https://example.com/a/very/long/path"
                    className="h-10 rounded-xl"
                    required
                    autoFocus
                  />
                  <FieldDescription>
                    The link has to start with http:// or https://.
                  </FieldDescription>
                </Field>

                <div className="flex justify-end gap-2 pt-1">
                  <DialogClose
                    render={<Button variant="outline" className="h-9" />}
                  >
                    Cancel
                  </DialogClose>
                  <Button
                    type="submit"
                    className="h-9 gap-1.5"
                    disabled={loading || !destination.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2Icon className="size-3.5 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      <>
                        Create link
                        <ArrowRightIcon className="size-3.5" />
                      </>
                    )}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
