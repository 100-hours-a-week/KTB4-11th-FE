import type { ChartOptions, DeepPartial, Time } from "lightweight-charts";

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
  if (!match) return cssVar;
  const resolved = getComputedStyle(document.documentElement)
    .getPropertyValue(match[1])
    .trim();
  return resolved || cssVar;
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
