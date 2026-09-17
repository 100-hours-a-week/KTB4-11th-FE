"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import Alert from "@/assets/icons/fill/alert.svg";
import CheckCircle from "@/assets/icons/fill/check-circle.svg";
import Warning from "@/assets/icons/fill/warning.svg";

const TOAST_OFFSET = "52px";

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      visibleToasts={1}
      duration={3000}
      theme="light"
      className="toaster group"
      icons={{
        success: <CheckCircle className="text-icon-success size-6" />,
        info: <Alert className="size-6 text-gray-300" />,
        warning: <Warning className="text-icon-warning size-6" />,
        error: <Warning className="size-6 text-red-300" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-gray-700)",
          "--normal-text": "var(--color-text-neutral-inverse)",
          "--border-radius": "var(--radius-r3)",
          "--width": "min(440px, calc(100vw - 40px))",
          width: "min(440px, calc(100vw - 40px))",
          left: "50%",
          right: "auto",
          transform: "translateX(-50%)",
        } as React.CSSProperties
      }
      position="bottom-center"
      offset={{ bottom: TOAST_OFFSET }}
      mobileOffset={{ left: 0, right: 0, bottom: TOAST_OFFSET }}
      toastOptions={{
        classNames: {
          toast: "!border-none",
          title: "!body-2-semibold opacity-[88%]",
          icon: "!ml-0 !mr-0 !size-6",
          actionButton:
            "!body-2-medium text-text-neutral-tertiary !h-auto !shrink-0 !bg-transparent !p-0",
        },
      }}
      {...props}
    />
  );
}
