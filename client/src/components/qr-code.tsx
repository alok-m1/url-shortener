import { QRCodeSVG } from "qrcode.react"
import { cn } from "cn"

export function QrCode({
  value,
  className,
  label = "QR code",
}: {
  value: string
  className?: string
  label?: string
}) {
  return (
    <QRCodeSVG
      value={value}
      size={256}
      level="M"
      bgColor="#ffffff"
      fgColor="#101208"
      title={label}
      marginSize={0}
      className={cn("size-full", className)}
    />
  )
}
