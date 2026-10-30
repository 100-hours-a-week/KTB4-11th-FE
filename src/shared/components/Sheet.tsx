"use client";

import { Dialog } from "radix-ui";
import type { ComponentProps } from "react";
import { getMobileContainerElement } from "@/shared/components/MobileContainer";
import { cn } from "@/shared/utils/cn";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetHandle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-bg-neutral-tertiary mx-auto h-1 w-9 rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function SheetOverlay() {
  return (
    <Dialog.Overlay className="bg-bg-layer-overlay data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 backdrop-blur-overlay absolute inset-0 ease-out data-[state=closed]:duration-300 data-[state=open]:duration-500" />
  );
}

export function SheetPortal({
  children,
  ...props
}: ComponentProps<typeof Dialog.Portal>) {
  return (
    <Dialog.Portal container={getMobileContainerElement()} {...props}>
      <div className="fixed inset-0 z-50 mx-auto h-full max-w-120">
        <SheetOverlay />
        {children}
      </div>
    </Dialog.Portal>
  );
}

interface SheetContentProps extends ComponentProps<typeof Dialog.Content> {
  side?: "top" | "bottom";
}

export function SheetContent({
  side = "bottom",
  className,
  ...props
}: SheetContentProps) {
  return (
    <Dialog.Content
      className={cn(
        "bg-bg-layer-floating data-[state=closed]:animate-out data-[state=open]:animate-in absolute inset-x-0 max-h-[90%] w-full ease-out data-[state=closed]:duration-100 data-[state=open]:duration-500",
        side === "bottom" &&
          "rounded-t-r4 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom bottom-0",
        side === "top" &&
          "rounded-b-r4 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top pt-screen-top top-0",
        className,
      )}
      {...props}
    />
  );
}

export function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      className={cn("heading-1-semibold text-text-neutral-primary", className)}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof Dialog.Description>) {
  return (
    <Dialog.Description
      className={cn(
        "body-2-regular text-text-neutral-secondary mt-2",
        className,
      )}
      {...props}
    />
  );
}
