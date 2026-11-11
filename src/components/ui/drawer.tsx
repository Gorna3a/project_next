"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Drawer = ({
  shouldScaleBackground = true,
  direction = "right",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & {
  shouldScaleBackground?: boolean
}) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    direction={direction}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/60 backdrop-blur-sm", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        // PixelCode neobrutalist sheet: hard border against the page + offset shadow,
        // supports every vaul direction with the matching border side.
        "group/drawer fixed z-50 flex outline-none",
        "border-black bg-[#FFFDF5] text-black",
        "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0",
        "data-[vaul-drawer-direction=right]:h-full data-[vaul-drawer-direction=right]:w-[min(720px,100vw)]",
        "data-[vaul-drawer-direction=right]:border-l-[3px] data-[vaul-drawer-direction=right]:shadow-[-6px_0_0_0_rgba(0,0,0,0.35)]",
        "data-[vaul-drawer-direction=right]:flex-col",
        "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0",
        "data-[vaul-drawer-direction=left]:h-full data-[vaul-drawer-direction=left]:w-[min(720px,100vw)]",
        "data-[vaul-drawer-direction=left]:border-r-[3px] data-[vaul-drawer-direction=left]:shadow-[6px_0_0_0_rgba(0,0,0,0.35)]",
        "data-[vaul-drawer-direction=left]:flex-col",
        "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0",
        "data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[92vh]",
        "data-[vaul-drawer-direction=bottom]:rounded-t-none data-[vaul-drawer-direction=bottom]:border-t-[3px] data-[vaul-drawer-direction=bottom]:shadow-[0_-6px_0_0_rgba(0,0,0,0.35)]",
        "data-[vaul-drawer-direction=bottom]:flex-col",
        "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0",
        "data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[92vh]",
        "data-[vaul-drawer-direction=top]:border-b-[3px] data-[vaul-drawer-direction=top]:flex-col",
        className,
      )}
      {...props}
    >
      {/* Drag handle — visible on bottom/top sheets only */}
      <div className="mx-auto mt-3 hidden h-1.5 w-12 border border-black bg-[#FFD23F] group-data-[vaul-drawer-direction=bottom]/drawer:block group-data-[vaul-drawer-direction=top]/drawer:block" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = DrawerPrimitive.Content.displayName

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // PixelCode black header bar with yellow accent — mirrors the classroom header
      "flex items-center justify-between gap-3 border-b-[3px] border-black bg-black px-4 py-3 text-white",
      className,
    )}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerHeaderClose = ({
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "border-[2px] border-black bg-[#FFD23F] p-1.5 text-black shadow-[2px_2px_0_0_#000]",
      "transition-all hover:bg-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
      className,
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
)
DrawerHeaderClose.displayName = "DrawerHeaderClose"

const DrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex-1 overflow-y-auto p-4 sm:p-5", className)}
    {...props}
  />
)
DrawerBody.displayName = "DrawerBody"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-2 border-t-[3px] border-black bg-white p-4",
      className,
    )}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "font-mono text-xs font-black uppercase tracking-widest text-white",
      className,
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("font-mono text-[10px] font-bold uppercase tracking-widest text-white/60", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerHeaderClose,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
