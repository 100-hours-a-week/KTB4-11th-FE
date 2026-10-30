// 종가 기준 단순 이동평균 계산

import type { Time } from "lightweight-charts";
import type { Bar } from "@/features/stock/types/chart";
import { toUnixTime } from "@/shared/utils/chartFormat";

export interface MovingAveragePoint {
  time: Time;
  value: number;
}

// period개 미만인 구간은 계산 불가하므로 건너뜀
export function calculateMovingAverage(
  bars: Bar[],
  period: number,
): MovingAveragePoint[] {
  const points: MovingAveragePoint[] = [];

  for (let i = period - 1; i < bars.length; i++) {
    const window = bars.slice(i - period + 1, i + 1);
    const sum = window.reduce((total, bar) => total + bar.close, 0);

    points.push({
      time: toUnixTime(bars[i].timestamp),
      value: sum / period,
    });
  }

  return points;
}
