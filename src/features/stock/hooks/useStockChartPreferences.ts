"use client";

// 차트 선택값 복원, URL 설정 우선 적용 및 사용자 변경값 저장 관리

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { ChartPeriod } from "@/features/stock/types/stockDetail";
import {
  isMinuteChart,
  type ChartGranularity,
} from "@/features/stock/utils/chart/chartPeriod";
import { resolveChartPreferences } from "@/features/stock/utils/chart/chartPreferences";
import {
  hydrateStockChartStore,
  useStockChartStore,
} from "@/store/stockChartStore";

export function useStockChartPreferences() {
  const searchParams = useSearchParams();
  const saved = useStockChartStore((state) => state.preferences);
  const hydrated = useStockChartStore((state) => state.hydrated);
  const setPreferences = useStockChartStore((state) => state.setPreferences);
  const { detailed, period, granularity, minute } = resolveChartPreferences(
    searchParams,
    saved,
  );

  useEffect(() => {
    void hydrateStockChartStore();
  }, []);
  useEffect(() => {
    if (hydrated) setPreferences({ detailed, period, granularity, minute });
  }, [hydrated, detailed, period, granularity, minute, setPreferences]);

  function updatePreferences(patch: Partial<typeof saved>) {
    const next = { detailed, period, granularity, minute, ...patch };
    setPreferences(next);
    const url = new URL(window.location.href);
    url.searchParams.set("chart", next.detailed ? "detailed" : "simple");
    url.searchParams.set("period", next.period);
    url.searchParams.set("interval", next.granularity);
    url.searchParams.set("minute", next.minute);
    window.history.replaceState(null, "", url);
  }

  return {
    detailed,
    period,
    granularity,
    minute,
    hydrated,
    setDetailed: (value: boolean) => updatePreferences({ detailed: value }),
    setPeriod: (value: ChartPeriod) => updatePreferences({ period: value }),
    setGranularity: (value: ChartGranularity) =>
      updatePreferences({
        granularity: value,
        ...(isMinuteChart(value) ? { minute: value } : {}),
      }),
  };
}
