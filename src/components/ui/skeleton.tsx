import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // PixelCode neobrutalist placeholder — hard border over the surface colour
  return (
    <div
      className={cn(
        "animate-pulse border-[3px] border-black/15 bg-[#E4DFCE]",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
