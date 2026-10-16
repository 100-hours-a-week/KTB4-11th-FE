"use client";

import { useState } from "react";
import CheckCircleIcon from "@/assets/icons/fill/check-circle.svg";
import {
  CHART_PERIODS,
  type ChartPeriod,
} from "@/features/stock/types/stockDetail";
import { FilterChips } from "@/shared/components/FilterChips";

export function StockChartPlaceholder() {
  const [isDetailedChart, setIsDetailedChart] = useState(false);
  const [period, setPeriod] = useState<ChartPeriod>("1일");

  return (
    <div className="flex flex-col gap-3 px-5 pt-4">
      <button
        type="button"
        onClick={() => setIsDetailedChart((prev) => !prev)}
        className="flex w-fit items-center gap-1"
      >
        <CheckCircleIcon
          width={16}
          height={16}
          className={
            isDetailedChart ? "text-icon-accent" : "text-icon-neutral-secondary"
          }
        />
        <span className="caption-1-regular text-text-neutral-secondary">
          자세한 차트
        </span>
      </button>

      <div className="bg-bg-layer-default flex h-70 items-center justify-center rounded-2xl">
        <span className="caption-1-regular text-text-neutral-tertiary">
          {isDetailedChart ? "캔들 차트 준비 중이에요" : "차트 준비 중이에요"}
        </span>
      </div>

      <FilterChips
        options={CHART_PERIODS}
        value={period}
        onChange={setPeriod}
        className="grid grid-cols-6 gap-1.5"
        itemClassName="body-2-semibold px-2"
      />
    </div>
  );
}
