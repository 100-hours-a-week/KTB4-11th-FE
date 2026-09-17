import type { ComponentProps } from "react";
import { cn } from "@/shared/utils/cn";

type ButtonProps = ComponentProps<"button">;

export function Button({ className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "rounded-r3 body-1-semibold bg-bg-neutral-primary text-text-neutral-inverse flex h-14 w-full items-center justify-center transition-colors active:bg-gray-400 disabled:bg-gray-200",
        className,
      )}
      {...props}
    />
  );
}
