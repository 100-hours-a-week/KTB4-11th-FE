"use client";

// 차트 모드·기간·선택 상태와 조회 데이터 연결

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStockBarsQuery } from "@/features/stock/hooks/useStockBarsQuery";
import {
  CHART_PERIODS,
  type ChartPeriod,
} from "@/features/stock/types/stockDetail";
import {
  getDetailedChartConfig,
  getSimpleChartConfig,
  type ChartGranularity,
  type ChartMinute,
  isMinuteChart,
  CHART_GRANULARITIES,
} from "@/features/stock/utils/chart/chartPeriod";
import type { ChartSelection } from "@/features/stock/utils/chart/chartSelection";
import { selectPeriodBars } from "@/features/stock/utils/chart/stockChart";

export function useStockChart(code: string, price: number, dayChange: number) {
  const [selection, setSelection] = useState<ChartSelection | null>(null);
  const searchParams = useSearchParams();
  const detailed = searchParams.get("chart") === "detailed";
  function setDetailed(value: boolean) {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("chart", "detailed");
    else url.searchParams.delete("chart");
    window.history.replaceState(null, "", url);
  }
  const period =
    CHART_PERIODS.find((value) => value === searchParams.get("period")) ??
    "1일";
  const intervalParam = searchParams.get("interval") ?? "";
  const granularity: ChartGranularity = isMinuteChart(intervalParam)
    ? intervalParam
    : (CHART_GRANULARITIES.find((value) => value === intervalParam) ?? "일");
  const minuteParam = searchParams.get("minute") ?? "";
  const minute: ChartMinute = isMinuteChart(minuteParam) ? minuteParam : "60분";

  function setPeriod(value: ChartPeriod) {
    const url = new URL(window.location.href);
    url.searchParams.set("period", value);
    window.history.replaceState(null, "", url);
  }

  const changeGranularity = (value: ChartGranularity) => {
    const url = new URL(window.location.href);
    url.searchParams.set("interval", value);
    if (isMinuteChart(value)) url.searchParams.set("minute", value);
    window.history.replaceState(null, "", url);
  };
  const config = detailed
    ? getDetailedChartConfig(granularity)
    : getSimpleChartConfig(period);
  const query = useStockBarsQuery(code, config);
  const selected = useMemo(
    () => selectPeriodBars(query.data ?? [], detailed ? "전체" : period),
    [query.data, detailed, period],
  );
  const baseline =
    detailed || period === "1일" ? price - dayChange : selected.baseline;
  const amount = baseline > 0 ? price - baseline : dayChange;
  const labels: Record<ChartPeriod, string> = {
    "1일": "어제보다",
    "1주": "지난주보다",
    "3달": "3개월 전보다",
    "1년": "1년 전보다",
    전체: "처음보다",
  };
  return {
    selection,
    setSelection,
    currentPrice: price,
    previousClose: price - dayChange,
    detailed,
    setDetailed,
    period,
    setPeriod,
    granularity,
    setGranularity: changeGranularity,
    minute,
    query,
    bars: selected.bars,
    baseline,
    changeAmount: amount,
    changeRate: baseline > 0 ? (amount / baseline) * 100 : 0,
    comparisonLabel: detailed ? "어제보다" : labels[period],
  };
}

export type StockChartModel = ReturnType<typeof useStockChart>;
