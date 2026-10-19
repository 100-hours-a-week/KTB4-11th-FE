"use client";

// 차트 모드·기간·선택 상태와 조회 데이터 연결

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStockBarsQuery } from "@/features/stock/hooks/useStockBarsQuery";
import type { ChartPeriod } from "@/features/stock/types/stockDetail";
import {
  getDetailedChartConfig,
  getSimpleChartConfig,
  type ChartGranularity,
  type ChartMinute,
  isMinuteChart,
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
  const [period, setPeriod] = useState<ChartPeriod>("1일");
  const [granularity, setGranularity] = useState<ChartGranularity>("일");
  const [minute, setMinute] = useState<ChartMinute>("60분");
  const changeGranularity = (value: ChartGranularity) => {
    setGranularity(value);
    if (isMinuteChart(value)) setMinute(value);
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
