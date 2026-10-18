// 보이는 구간의 최고·최저 위치와 마지막 봉 가격 라벨 갱신

import type { IChartApi } from "lightweight-charts";
import type { Bar } from "@/features/stock/types/chart";
import type { ChartGranularity } from "@/features/stock/utils/chart/chartPeriod";
import type { createDetailedSeries } from "@/features/stock/utils/chart/chartSeries";
import {
  getBarExtremes,
  projectDetailedExtremes,
} from "@/features/stock/utils/chart/chartExtrema";
import { resolveCssColor, toUnixTime } from "@/shared/utils/chartFormat";

export function createDetailedViewport({
  chart,
  series,
  granularity,
  rise,
  fall,
}: {
  chart: IChartApi;
  series: ReturnType<typeof createDetailedSeries>["series"];
  granularity: ChartGranularity;
  rise: string;
  fall: string;
}) {
  const visiblePrice = series.createPriceLine({
    price: 0,
    color: rise,
    lineVisible: false,
    axisLabelVisible: false,
    axisLabelColor: resolveCssColor("var(--color-bg-layer-default)"),
  });
  return {
    read(bars: Bar[], currentPrice: number) {
      const height = chart.panes()[0].getHeight();
      const range = chart.timeScale().getVisibleLogicalRange();
      const visible = range
        ? bars.slice(
            Math.max(0, Math.ceil(range.from)),
            Math.min(bars.length, Math.floor(range.to) + 1),
          )
        : [];
      const extremes = getBarExtremes(visible, "ohlc");
      if (!extremes) {
        visiblePrice.applyOptions({ axisLabelVisible: false });
        return { volumeTop: height, extremes: [] };
      }
      const last = visible[visible.length - 1];
      const color = last.close >= last.open ? rise : fall;
      visiblePrice.applyOptions({
        price: last.close,
        color,
        axisLabelTextColor: color,
        axisLabelVisible: last.close !== currentPrice,
      });
      return {
        volumeTop: height,
        extremes: projectDetailedExtremes({
          ...extremes,
          currentPrice,
          granularity,
          rise,
          fall,
          height,
          width: chart.timeScale().width(),
          timeToX: (timestamp) =>
            chart.timeScale().timeToCoordinate(toUnixTime(timestamp)) ?? 0,
          priceToY: (value) => series.priceToCoordinate(value) ?? 0,
        }),
      };
    },
  };
}
