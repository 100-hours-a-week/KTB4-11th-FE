// 조회한 봉을 분·주·월·년 간격으로 집계

import { seoulDate } from "@/features/stock/utils/chart/stockChart";
import type { Bar, BarAggregateUnit } from "@/features/stock/types/chart";

// 주봉은 월요일, 월봉·연봉은 달력 기준
function getGroupKey(date: Date, unit: BarAggregateUnit): string {
  if (unit === "year") return `${date.getUTCFullYear()}`;
  if (unit === "month") return `${date.getUTCFullYear()}-${date.getUTCMonth()}`;

  const monday = new Date(date);
  const day = monday.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  monday.setUTCDate(monday.getUTCDate() + diffToMonday);

  return `${monday.getUTCFullYear()}-${monday.getUTCMonth()}-${monday.getUTCDate()}`;
}

// 서버에서 주봉·월봉·연봉을 제공하지 않아 일봉으로 집계
export function aggregateBars(bars: Bar[], unit: BarAggregateUnit): Bar[] {
  const groups = new Map<string, Bar[]>();

  for (const bar of bars) {
    const key = getGroupKey(seoulDate(bar.timestamp), unit);
    const group = groups.get(key);
    if (group) group.push(bar);
    else groups.set(key, [bar]);
  }

  return Array.from(groups.values()).map((group) => ({
    timestamp: group[0].timestamp,
    open: group[0].open,
    close: group[group.length - 1].close,
    high: Math.max(...group.map((bar) => bar.high)),
    low: Math.min(...group.map((bar) => bar.low)),
    volume: group.reduce((sum, bar) => sum + bar.volume, 0),
  }));
}

// 분봉 집계는 한국 시간 기준. 거래가 없는 시간은 빈 봉으로 채우지 않음
export function aggregateMinuteBars(bars: Bar[], minutes: number): Bar[] {
  const groups = new Map<number, Bar>();
  const offset = 9 * 60 * 60 * 1000;
  const interval = minutes * 60 * 1000;
  for (const bar of bars) {
    const bucket = Math.floor((Date.parse(bar.timestamp) + offset) / interval);
    const group = groups.get(bucket);
    if (!group)
      groups.set(bucket, {
        ...bar,
        // 구간 중간부터 데이터가 있어도 봉 시간은 해당 구간의 시작 시각으로 표시
        timestamp: new Date(bucket * interval - offset).toISOString(),
      });
    else {
      group.high = Math.max(group.high, bar.high);
      group.low = Math.min(group.low, bar.low);
      group.close = bar.close;
      group.volume += bar.volume;
    }
  }
  return [...groups.values()];
}
