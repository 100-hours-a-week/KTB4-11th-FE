"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface InputProps extends Omit<ComponentProps<"input">, "onChange"> {
  label?: string;
  helperText?: string;
  error?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  labelClassName?: string;
  onChange?: (value: string) => void;
}

export function Input({
  label,
  helperText,
  error,
  left,
  right,
  id,
  disabled,
  className,
  labelClassName,
  onChange,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperTextId = `${inputId}-helper`;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            labelClassName ?? "body-2-semibold",
            "text-text-neutral-primary",
          )}
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "bg-bg-layer-default flex items-center gap-2 rounded-2xl border-[1.4px] p-4",
          "focus-within:border-border-accent",
          error && "border-border-error",
          disabled && "bg-bg-layer-basement border-border-neutral-muted",
          !error && !disabled && "border-transparent",
        )}
      >
        {left && <span className="text-icon-neutral-secondary">{left}</span>}
        <input
          id={inputId}
          disabled={disabled}
          aria-describedby={helperText ? helperTextId : undefined}
          className={cn(
            "body-1-medium text-text-neutral-secondary focus:text-text-neutral-primary disabled:text-text-neutral-tertiary w-full overflow-hidden bg-transparent text-ellipsis whitespace-nowrap outline-none",
            className,
          )}
          onChange={(event) => onChange?.(event.target.value)}
          {...props}
        />
        {right && <span className="text-icon-neutral-secondary">{right}</span>}
      </div>
      {helperText && (
        <p
          id={helperTextId}
          className={cn(
            "body-2-regular",
            error ? "text-text-error" : "text-text-neutral-secondary",
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
