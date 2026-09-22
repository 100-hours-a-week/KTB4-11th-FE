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
        "flex w-full shrink-0 items-center justify-between px-5 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {left}
        {title && <span className="heading-1-bold">{title}</span>}
      </div>
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
    <button
      type="button"
      onClick={onClick ?? (() => router.back())}
      className="text-text-neutral-primary flex h-7 w-7 items-center justify-center"
    >
      <ChevronBackwardIcon width={24} height={24} />
    </button>
  );
}
