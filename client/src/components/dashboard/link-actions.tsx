import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  CopyIcon,
  ExternalLinkIcon,
  Loader2Icon,
  MoreHorizontalIcon,
  QrCodeIcon,
  Trash2Icon,
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
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LinkActions({ link }: { link: ApiUrl }) {
  const navigate = useNavigate()
  const { deleteUrl } = useDashboardData()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(link.shortUrl)
      toast.success("Link copied", { description: link.shortUrl })
    } catch {
      toast.error("Could not copy the link")
    }
  }

  function openLink() {
    window.open(link.shortUrl, "_blank", "noopener,noreferrer")
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteUrl(link.id)
      toast.success("Link deleted", {
        description: `/${link.shortCode} has been removed.`,
      })
      setConfirmOpen(false)
    } catch (error) {
      toast.error("Could not delete the link", {
        description: getApiErrorMessage(error),
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label={`Actions for ${link.shortCode}`}
            />
          }
        >
          <MoreHorizontalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44" sideOffset={4}>
          <DropdownMenuItem className="gap-2" onClick={copy}>
            <CopyIcon />
            Copy link
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2" onClick={openLink}>
            <ExternalLinkIcon />
            Open link
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2"
            onClick={() => navigate({ to: "/dashboard/qr-codes" })}
          >
            <QrCodeIcon />
            View QR code
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="gap-2"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2Icon />
            Delete link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this link?</DialogTitle>
            <DialogDescription>
              <span className="font-mono text-foreground">
                {link.shortCode}
              </span>{" "}
              will stop redirecting immediately. Its{" "}
              {link.clicks.toLocaleString()} recorded clicks will go with it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <DialogClose render={<Button variant="outline" className="h-9" />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              className="h-9 gap-1.5"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? (
                <Loader2Icon className="size-3.5 animate-spin" />
              ) : (
                <Trash2Icon className="size-3.5" />
              )}
              Delete link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
