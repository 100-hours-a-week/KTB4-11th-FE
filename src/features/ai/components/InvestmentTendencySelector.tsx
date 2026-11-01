"use client";

import {
  INVESTMENT_TENDENCIES,
  type InvestmentTendency,
} from "@/features/ai/types/aiStrategy";
import { cn } from "@/shared/utils/cn";

const TENDENCY_DOT_COLORS: Record<InvestmentTendency, string> = {
  성장형: "bg-red-500",
  성장추구형: "bg-orange-500",
  위험중립형: "bg-yellow-500",
  안정추구형: "bg-green-500",
  안정형: "bg-blue-500",
};

const TENDENCY_DOT_MUTED_COLORS: Record<InvestmentTendency, string> = {
  성장형: "bg-red-200",
  성장추구형: "bg-orange-200",
  위험중립형: "bg-yellow-200",
  안정추구형: "bg-green-200",
  안정형: "bg-blue-200",
};

interface InvestmentTendencySelectorProps {
  value: InvestmentTendency;
  onChange: (value: InvestmentTendency) => void;
}

export function InvestmentTendencySelector({
  value,
  onChange,
}: InvestmentTendencySelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="body-1-bold">투자 성향</span>
      <div className="relative flex items-center justify-between">
        <div className="bg-bg-layer-default absolute inset-x-2 top-1.5 h-px" />
        {INVESTMENT_TENDENCIES.map((tendency) => {
          const isSelected = value === tendency;

          return (
            <button
              key={tendency}
              type="button"
              onClick={() => onChange(tendency)}
              className="relative flex flex-col items-center gap-2"
            >
              <span
                className={cn(
                  "size-3 rounded-full transition-transform",
                  isSelected
                    ? [TENDENCY_DOT_COLORS[tendency], "scale-125"]
                    : TENDENCY_DOT_MUTED_COLORS[tendency],
                )}
              />
              <span
                className={cn(
                  "caption-1-regular",
                  isSelected
                    ? "text-text-neutral-primary"
                    : "text-text-neutral-secondary",
                )}
              >
                {tendency}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
