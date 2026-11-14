import { toChartColor } from "./chartColor";
import {
  AreaSeries,
  LineSeries,
  type ChartOptions,
  type DeepPartial,
  type IChartApi,
  type Time,
} from "lightweight-charts";

export function toUnixTime(date: string): Time {
  return Math.floor(new Date(date).getTime() / 1000) as Time;
}

export function formatAxisTick(time: Time) {
  const d = new Date((time as number) * 1000);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function formatTooltipDate(time: Time) {
  const d = new Date((time as number) * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export function resolveCssColor(cssVar: string) {
  const match = /var\((--[\w-]+)\)/.exec(cssVar);
  if (!match) return toChartColor(cssVar);
  const resolved = getComputedStyle(document.documentElement)
    .getPropertyValue(match[1])
    .trim();
  return toChartColor(resolved || cssVar);
}

// 공통 차트 기본 설정 (십자선 옵션은 사용하는 차트에서 지정)
export function createBaseChartOptions(
  tertiaryColor: string,
): Omit<DeepPartial<ChartOptions>, "crosshair"> {
  return {
    autoSize: true,
    layout: {
      background: { color: "transparent" },
      textColor: tertiaryColor,
      fontSize: 11,
      attributionLogo: false,
    },
    grid: {
      vertLines: { visible: false },
      horzLines: { visible: false },
    },
    rightPriceScale: { visible: false },
    timeScale: {
      borderVisible: false,
      tickMarkFormatter: formatAxisTick,
      tickMarkMaxCharacterLength: 5,
      allowBoldLabels: false,
      fixLeftEdge: true,
      fixRightEdge: true,
    },
    handleScroll: true,
    handleScale: true,
  };
}

// 비교 차트(2개 이상 시리즈)에서 공통으로 쓰는 십자선 옵션 — 세로선만 표시
export function createCompareCrosshairOptions(
  tertiaryColor: string,
): DeepPartial<ChartOptions>["crosshair"] {
  return {
    vertLine: { color: tertiaryColor, width: 1, labelVisible: false },
    horzLine: { visible: false, labelVisible: false },
  };
}

// 강조 시리즈는 그라데이션 영역, 나머지는 단색 선으로 추가
export function addHighlightableSeries(
  chart: IChartApi,
  color: string,
  highlighted: boolean,
) {
  if (highlighted) {
    return chart.addSeries(AreaSeries, {
      lineColor: color,
      topColor: toChartColor(color, 64 / 255),
      bottomColor: toChartColor(color, 0),
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerRadius: 3,
    });
  }
  return chart.addSeries(LineSeries, {
    color,
    lineWidth: 2,
    priceLineVisible: false,
    lastValueVisible: false,
    crosshairMarkerRadius: 3,
  });
}
