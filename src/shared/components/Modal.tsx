"use client";

import { Dialog } from "radix-ui";
import type { ComponentProps } from "react";
import { getMobileContainerElement } from "@/shared/components/MobileContainer";
import { cn } from "@/shared/utils/cn";

export const Modal = Dialog.Root;
export const ModalClose = Dialog.Close;

function ModalOverlay() {
  return (
    <Dialog.Overlay className="bg-bg-layer-overlay data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 backdrop-blur-overlay absolute inset-0 duration-500 ease-out" />
  );
}

export function ModalPortal({
  children,
  ...props
}: ComponentProps<typeof Dialog.Portal>) {
  return (
    <Dialog.Portal container={getMobileContainerElement()} {...props}>
      <ModalOverlay />
      {children}
    </Dialog.Portal>
  );
}

export function ModalContent({
  className,
  ...props
}: ComponentProps<typeof Dialog.Content>) {
  return (
    <Dialog.Content
      className={cn(
        "rounded-r4 bg-bg-layer-floating data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 absolute top-1/2 left-1/2 w-[calc(100%-70px)] max-w-[410px] -translate-x-1/2 -translate-y-1/2 p-6 duration-300 ease-out",
        className,
      )}
      {...props}
    />
  );
}

export function ModalTitle({
  className,
  ...props
}: ComponentProps<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      className={cn(
        "heading-1-bold text-text-neutral-primary text-center",
        className,
      )}
      {...props}
    />
  );
}

export function ModalDescription({
  className,
  ...props
}: ComponentProps<typeof Dialog.Description>) {
  return (
    <Dialog.Description
      className={cn(
        "body-2-regular text-text-neutral-secondary mt-2 text-center",
        className,
      )}
      {...props}
    />
  );
}

export function ModalBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-5", className)} {...props} />;
}

export function ModalFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-5 flex gap-2.5", className)} {...props} />;
}
