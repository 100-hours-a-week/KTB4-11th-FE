"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import ChevronBackwardIcon from "@/assets/icons/fill/chevron-backward.svg";
import { cn } from "@/shared/utils/cn";

interface HeaderProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function Header({ title, left, right, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "relative flex w-full shrink-0 items-center justify-between",
        className,
      )}
    >
      <div className="flex items-center">{left}</div>
      {title && (
        <span className="heading-1-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {title}
        </span>
      )}
      <div className="flex items-center gap-3">{right}</div>
    </header>
  );
}

interface HeaderBackButtonProps {
  onClick?: () => void;
}

export function HeaderBackButton({ onClick }: HeaderBackButtonProps) {
  const router = useRouter();

  return (
    <button type="button" onClick={onClick ?? (() => router.back())}>
      <ChevronBackwardIcon className="text-icon-neutral-secondary size-7.5" />
    </button>
  );
}
