"use client";

import type { ComponentProps } from "react";
import { cn } from "@/shared/utils/cn";

interface InitialAmountFieldProps extends Omit<
  ComponentProps<"input">,
  "onChange"
> {
  onChange?: (value: string) => void;
  error?: string;
}

export function InitialAmountField({
  className,
  error,
  onChange,
  ...props
}: InitialAmountFieldProps) {
  return (
    <div
      className={cn(
        "bg-bg-layer-default flex flex-col gap-2 rounded-2xl p-4",
        className,
      )}
    >
      <label className="caption-1-regular text-text-neutral-primary">
        투입 금액
      </label>
      <div className="flex items-end justify-between">
        <input
          type="text"
          inputMode="numeric"
          className="title-1 text-text-neutral-primary w-full bg-transparent outline-none"
          onChange={(event) => onChange?.(event.target.value)}
          {...props}
        />
        <span className="body-1-medium text-text-neutral-primary">원</span>
      </div>
      {error ? (
        <p className="caption-1-regular text-text-error flex items-center gap-1">
          {error}
        </p>
      ) : (
        <p className="caption-1-regular text-text-neutral-secondary">
          100만 ~ 1억 사이
        </p>
      )}
    </div>
  );
}
