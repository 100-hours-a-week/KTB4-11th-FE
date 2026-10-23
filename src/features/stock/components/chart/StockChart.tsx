"use client";

// 기본·상세 차트 전환, 기간 선택, 로딩·오류 표시

import CheckCircleIcon from "@/assets/icons/fill/check-circle.svg";
import { StockDetailedChart } from "@/features/stock/components/chart/StockDetailedChart";
import { StockSimpleChart } from "@/features/stock/components/chart/StockSimpleChart";
import { CHART_PERIODS } from "@/features/stock/types/stockDetail";
import { StockChartIntervalChips } from "@/features/stock/components/chart/StockChartIntervalChips";
import type { StockChartModel } from "@/features/stock/hooks/useStockChart";
import { FilterChips } from "@/shared/components/FilterChips";

export function StockChart({ model }: { model: StockChartModel }) {
  const {
    detailed,
    setDetailed,
    period,
    setPeriod,
    granularity,
    setGranularity,
    query,
    bars,
  } = model;
  return (
    <section aria-label="종목 차트" className="flex flex-col gap-3 px-5 pt-4">
      <button
        type="button"
        aria-pressed={detailed}
        onClick={() => setDetailed(!detailed)}
        className="flex w-fit items-center gap-1"
      >
        <CheckCircleIcon
          width={18}
          height={18}
          className={
            detailed ? "text-icon-accent" : "text-icon-neutral-secondary"
          }
        />
        <span className="body-2-medium text-text-neutral-secondary">
          자세한 차트
        </span>
      </button>
      {query.isError ? (
        <div className="flex h-70 flex-col items-center justify-center gap-3">
          <p className="body-2-medium text-text-neutral-secondary">
            차트를 불러오지 못했어요
          </p>
          <button
            type="button"
            className="body-2-semibold text-text-accent"
            onClick={() => query.refetch()}
          >
            다시 시도
          </button>
        </div>
      ) : !bars.length ? (
        <div className="flex h-70 items-center justify-center">
          <p className="body-2-medium text-text-neutral-secondary">
            {query.isPending
              ? "차트를 불러오는 중이에요"
              : "차트 데이터가 없어요"}
          </p>
        </div>
      ) : detailed ? (
        <StockDetailedChart
          key={granularity}
          bars={bars}
          granularity={granularity}
          onSelectionChange={model.setSelection}
          currentPrice={model.currentPrice}
          previousClose={model.previousClose}
          movingAverage={true}
          volume={true}
          candle={true}
        />
      ) : (
        <>
          <StockSimpleChart
            key={period}
            bars={bars}
            period={period}
            tick={
              model.priceTimestamp
                ? { price: model.currentPrice, timestamp: model.priceTimestamp }
                : undefined
            }
            baseline={period === "1일" ? model.baseline : 0}
            intraday={period === "1일" || period === "1주"}
            rise={model.changeAmount >= 0}
          />
        </>
      )}
      {detailed ? (
        <StockChartIntervalChips
          value={granularity}
          minute={model.minute}
          onChange={setGranularity}
        />
      ) : (
        <FilterChips
          options={CHART_PERIODS}
          value={period}
          onChange={setPeriod}
          className="grid grid-cols-5 gap-1.5"
          itemClassName="body-2-semibold px-2"
        />
      )}
    </section>
  );
}
