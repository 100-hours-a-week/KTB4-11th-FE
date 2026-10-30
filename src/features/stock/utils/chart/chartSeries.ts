// 캔들·이동평균·거래량 시리즈 구성과 데이터 반영

import {
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  type IChartApi,
} from "lightweight-charts";
import type { Bar } from "@/features/stock/types/chart";
import { calculateMovingAverage } from "@/features/stock/utils/chart/calculateMovingAverage";
import { MOVING_AVERAGES } from "@/features/stock/utils/chart/stockChart";
import { toUnixTime } from "@/shared/utils/chartFormat";

export function createDetailedSeries(
  chart: IChartApi,
  options: {
    candle: boolean;
    movingAverage: boolean;
    volume: boolean;
    rise: string;
    fall: string;
  },
) {
  const { candle, movingAverage, volume, rise, fall } = options;
  const series = candle
    ? chart.addSeries(CandlestickSeries, {
        upColor: rise,
        downColor: fall,
        wickUpColor: rise,
        wickDownColor: fall,
        borderVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
        priceFormat: { type: "price", precision: 0, minMove: 1 },
      })
    : chart.addSeries(LineSeries, {
        color: rise,
        lineWidth: 2,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
        priceFormat: { type: "price", precision: 0, minMove: 1 },
      });
  series
    .priceScale()
    .applyOptions({ scaleMargins: { top: 0.16, bottom: 0.14 } });
  const averages = movingAverage
    ? MOVING_AVERAGES.map(({ period, color }) => ({
        period,
        series: chart.addSeries(LineSeries, {
          color,
          lineWidth: 1,
          lastValueVisible: false,
          priceLineVisible: false,
          crosshairMarkerVisible: false,
        }),
      }))
    : [];
  const histogram = volume
    ? chart.addSeries(
        HistogramSeries,
        {
          priceScaleId: "right",
          priceFormat: { type: "volume" },
          priceLineVisible: false,
        },
        1,
      )
    : null;
  const volumeAverage = volume
    ? chart.addSeries(
        LineSeries,
        {
          color: MOVING_AVERAGES[0].color,
          lineWidth: 1,
          priceLineVisible: false,
          crosshairMarkerVisible: false,
          priceFormat: { type: "volume" },
        },
        1,
      )
    : null;
  if (histogram) {
    histogram
      .priceScale()
      .applyOptions({ scaleMargins: { top: 0.15, bottom: 0 } });
    chart.panes()[0].setStretchFactor(4);
    chart.panes()[1].setStretchFactor(1);
  }
  return {
    series,
    updateBars(bars: Bar[]) {
      if (candle)
        series.setData(
          bars.map((bar) => ({ ...bar, time: toUnixTime(bar.timestamp) })),
        );
      else {
        series.setData(
          bars.map((bar) => ({
            time: toUnixTime(bar.timestamp),
            value: bar.close,
          })),
        );
        if (bars.length)
          series.applyOptions({
            color: bars.at(-1)!.close >= bars[0].close ? rise : fall,
          });
      }
      for (const average of averages)
        average.series.setData(calculateMovingAverage(bars, average.period));
      histogram?.setData(
        bars.map((bar) => ({
          time: toUnixTime(bar.timestamp),
          value: bar.volume,
          color: bar.close >= bar.open ? rise : fall,
        })),
      );
      volumeAverage?.setData(
        calculateMovingAverage(
          bars.map((bar) => ({ ...bar, close: bar.volume })),
          20,
        ),
      );
    },
  };
}
