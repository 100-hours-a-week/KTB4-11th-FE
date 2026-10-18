// 선택한 봉의 가격·등락률·이동평균 상세 정보

import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";
import type { ChartSelection } from "@/features/stock/utils/chart/chartSelection";
import { formatStockChartDate } from "@/features/stock/utils/chart/stockChart";
import {
  isMinuteChart,
  type ChartGranularity,
} from "@/features/stock/utils/chart/chartPeriod";

export function StockChartSelectionSummary({
  name,
  selection,
  currentPrice,
  previousClose,
  granularity,
}: {
  name: string;
  selection: ChartSelection;
  currentPrice: number;
  previousClose: number;
  granularity: ChartGranularity;
}) {
  const rate = (value: number, baseline: number) =>
    baseline > 0 ? (value / baseline - 1) * 100 : 0;
  const percent = (value: number) =>
    value === 0 ? "+0.00%" : formatSignedPercent(value, 2);
  const priceClass = (value: number) =>
    value === 0
      ? "text-text-neutral-secondary"
      : getReturnRateInfo(value).colorClass;
  const change = rate(currentPrice, previousClose);
  return (
    <div
      className="bg-bg-layer-default rounded-r4 relative z-20 flex flex-col gap-3 px-5 py-3"
      aria-label="선택한 봉 상세 정보"
    >
      <div className="body-2-medium flex flex-wrap items-center justify-between gap-1">
        <span>
          {name}{" "}
          {formatStockChartDate(
            selection.bar.timestamp,
            isMinuteChart(granularity),
            granularity,
          )}
        </span>
        <span>
          {currentPrice.toLocaleString()}원{" "}
          <span className={priceClass(change)}>({percent(change)})</span>
        </span>
      </div>
      <dl className="caption-1-regular border-border-neutral-muted grid grid-cols-2 gap-x-4 gap-y-1 border-y py-2">
        {(
          [
            ["시작", "open"],
            ["최고", "high"],
            ["마지막", "close"],
            ["최저", "low"],
          ] as const
        ).map(([label, field]) => {
          const value = selection.bar[field];
          const change = rate(value, selection.baseline);
          return (
            <div key={field} className="flex flex-wrap justify-between gap-x-1">
              <dt className="text-text-neutral-secondary">{label}</dt>
              <dd>
                {value.toLocaleString()}원{" "}
                <span className={priceClass(change)}>({percent(change)})</span>
              </dd>
            </div>
          );
        })}
      </dl>
      <div>
        <p className="caption-1-semibold text-text-neutral-secondary mb-1">
          이동평균선
        </p>
        <dl className="caption-1-regular grid grid-cols-2 gap-x-4 gap-y-1">
          {selection.averages.map(({ period, color, value }) => (
            <div key={period} className="flex justify-between">
              <dt style={{ color }}>{period}</dt>
              <dd className="text-text-neutral-secondary">
                {value === null
                  ? "—"
                  : `${Math.round(value).toLocaleString()}원`}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
