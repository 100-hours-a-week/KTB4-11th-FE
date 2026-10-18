// 차트 기본 설정과 날짜 축 표시 형식

import {
  CrosshairMode,
  TickMarkType,
  type DeepPartial,
  type ChartOptions,
  type Time,
} from "lightweight-charts";
import {
  formatStockChartDate,
  seoulDate,
} from "@/features/stock/utils/chart/stockChart";
import { isMinuteChart } from "@/features/stock/utils/chart/chartPeriod";

export function stockChartOptions(
  textColor: string,
): DeepPartial<ChartOptions> {
  return {
    autoSize: true,
    layout: {
      background: { color: "transparent" },
      textColor,
      fontFamily: '"Pretendard Variable", sans-serif',
      fontSize: 12,
      attributionLogo: false,
    },
    localization: {
      locale: "ko-KR",
      priceFormatter: (price: number) =>
        Math.round(price).toLocaleString("ko-KR"),
    },
    grid: {
      vertLines: { color: "#e9e9ed70" },
      horzLines: { color: "#e9e9ed70" },
    },
    rightPriceScale: {
      visible: true,
      borderColor: "#e9e9ed",
      minimumWidth: 72,
    },
    timeScale: {
      borderColor: "#e9e9ed",
      rightOffset: 1,
      barSpacing: 14,
      minBarSpacing: 3,
      fixLeftEdge: false,
      fixRightEdge: false,
      allowBoldLabels: true,
    },
    handleScroll: {
      vertTouchDrag: false,
      horzTouchDrag: true,
      mouseWheel: true,
      pressedMouseMove: true,
    },
    handleScale: { pinch: true, mouseWheel: true, axisPressedMouseMove: true },
  };
}

export function stockAxisTick(
  time: Time,
  granularity: string,
  tickType: TickMarkType,
) {
  const date = seoulDate(new Date(Number(time) * 1000).toISOString());
  if (granularity === "년" || tickType === TickMarkType.Year)
    return String(date.getUTCFullYear());
  if (granularity === "월" || tickType === TickMarkType.Month)
    return `${date.getUTCMonth() + 1}월`;
  if (
    tickType === TickMarkType.Time ||
    tickType === TickMarkType.TimeWithSeconds
  )
    return `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
  return `${date.getUTCDate()}일`;
}

export function detailedChartOptions(
  muted: string,
  granularity: string,
  width: number,
  height: number,
): DeepPartial<ChartOptions> {
  return {
    ...stockChartOptions(muted),
    autoSize: false,
    width: width,
    height: height,
    timeScale: {
      tickMarkFormatter: (time: Time, tickType: TickMarkType) =>
        stockAxisTick(time, granularity, tickType),
      rightOffset: 1,
      barSpacing: 14,
      // 최대 확대는 라이브러리 기본값: 봉 간격이 차트 너비의 절반
      minBarSpacing: 0.5,
      tickMarkMaxCharacterLength: 6,
      allowBoldLabels: true,
      borderColor: "#e9e9ed",
    },
    crosshair: {
      mode: CrosshairMode.Normal,
      vertLine: {
        visible: false,
        labelVisible: false,
        labelBackgroundColor: "#191919",
      },
      horzLine: {
        visible: false,
        labelVisible: false,
        labelBackgroundColor: "#191919",
      },
    },
    localization: {
      locale: "ko-KR",
      priceFormatter: (value: number) =>
        Math.round(value).toLocaleString("ko-KR"),
      timeFormatter: (time: Time) =>
        formatStockChartDate(
          new Date(Number(time) * 1000).toISOString(),
          isMinuteChart(granularity),
        ),
    },
  };
}
