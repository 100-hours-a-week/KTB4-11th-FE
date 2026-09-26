"use client";

import { DropdownMenu } from "radix-ui";
import type { HoldingsSort } from "@/features/account/types/holdingStock";
import ChevronDownIcon from "@/assets/icons/fill/chevron-down.svg";
import { cn } from "@/shared/utils/cn";

const SORT_LABEL: Record<HoldingsSort, string> = {
  latest_purchase: "최신 매수순",
  return_rate: "수익률순",
  market_value: "평가금액순",
};

const SORT_OPTIONS = Object.keys(SORT_LABEL) as HoldingsSort[];

interface HoldingsSortDropdownProps {
  value: HoldingsSort;
  onChange: (value: HoldingsSort) => void;
}

export function HoldingsSortDropdown({
  value,
  onChange,
}: HoldingsSortDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="border-border-neutral-muted bg-bg-layer-default text-text-neutral-secondary caption-1-regular flex items-center gap-1 rounded-full border px-2.5 py-1"
        >
          {SORT_LABEL[value]}
          <ChevronDownIcon width={10} height={5} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="bg-bg-layer-default ring-border-neutral-muted flex flex-col rounded-2xl p-1 shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] ring-1 outline-hidden"
        >
          {SORT_OPTIONS.map((option) => (
            <DropdownMenu.Item
              key={option}
              onSelect={() => onChange(option)}
              className={cn(
                "cursor-pointer rounded-xl px-3 py-2 outline-none",
                option === value
                  ? "bg-sky-blue-50 caption-1-semibold text-text-accent"
                  : "caption-1-regular text-text-neutral-primary",
              )}
            >
              {SORT_LABEL[option]}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
