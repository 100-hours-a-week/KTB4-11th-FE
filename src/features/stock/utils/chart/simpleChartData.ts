import type {
  LineData,
  UTCTimestamp,
  WhitespaceData,
} from "lightweight-charts";
import type { Bar } from "@/features/stock/types/chart";
import type { ChartPeriod } from "@/features/stock/types/stockDetail";
import { seoulDate } from "@/features/stock/utils/chart/stockChart";

export interface SimpleChartTick {
  price: number;
  timestamp: string;
}

const MINUTE = 60_000;
const SEOUL_OFFSET = 9 * 60 * MINUTE;
const dayKey = (timestamp: string) =>
  seoulDate(timestamp).toISOString().slice(0, 10);

export function tradingSession(timestamp: string) {
  const day = seoulDate(timestamp);
  const midnight = Date.UTC(
    day.getUTCFullYear(),
    day.getUTCMonth(),
    day.getUTCDate(),
  );
  return {
    start: midnight - SEOUL_OFFSET + 9 * 60 * MINUTE,
    end: midnight - SEOUL_OFFSET + (15 * 60 + 30) * MINUTE,
    weekday: day.getUTCDay() !== 0 && day.getUTCDay() !== 6,
  };
}

// REST 봉은 유지하고 마지막 구간만 시세로 갱신 (상세 차트에는 적용하지 않음)
export function buildSimpleChartData(
  bars: Bar[],
  period: ChartPeriod,
  tick?: SimpleChartTick,
  now = Date.now(),
) {
  const last = bars.at(-1);
  const tickTime = tick ? Date.parse(tick.timestamp) : NaN;
  const tickSession = Number.isFinite(tickTime)
    ? tradingSession(tick!.timestamp)
    : null;
  const usableTick = !!(
    tick &&
    Number.isFinite(tick.price) &&
    tick.price > 0 &&
    tickSession?.weekday &&
    tickTime >= tickSession.start &&
    tickTime <= tickSession.end &&
    tickTime <= now + MINUTE &&
    (!last || tickTime >= Date.parse(last.timestamp))
  );
  const day = usableTick ? tick!.timestamp : last?.timestamp;
  const session = period === "1일" && day ? tradingSession(day) : null;
  const byTime = new Map<number, Bar>();
  for (const bar of bars) {
    const time = Date.parse(bar.timestamp);
    if (!Number.isFinite(time) || !Number.isFinite(bar.close) || bar.close <= 0)
      continue;
    if (session && (time < session.start || time > session.end || time > now))
      continue;
    const slot = period === "1일" ? Math.floor(time / MINUTE) * MINUTE : time;
    byTime.set(slot, { ...bar, timestamp: new Date(slot).toISOString() });
  }
  if (usableTick) {
    let slot = Math.floor(tickTime / MINUTE) * MINUTE;
    const previous = [...byTime.values()].at(-1);
    if (period === "1주") {
      slot = Math.floor(tickTime / (15 * MINUTE)) * 15 * MINUTE;
    } else if (
      period !== "1일" &&
      previous &&
      dayKey(previous.timestamp) === dayKey(tick!.timestamp)
    ) {
      slot = Date.parse(previous.timestamp);
    }
    const existing = byTime.get(slot);
    byTime.set(slot, {
      timestamp: new Date(slot).toISOString(),
      open: existing?.open ?? tick!.price,
      high: Math.max(existing?.high ?? tick!.price, tick!.price),
      low: Math.min(existing?.low ?? tick!.price, tick!.price),
      close: tick!.price,
      volume: existing?.volume ?? 0,
    });
  }
  const displayedBars = [...byTime.values()].sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
  );
  const data: (LineData<UTCTimestamp> | WhitespaceData<UTCTimestamp>)[] = [];
  if (session) {
    // 미래 구간은 가격 없는 분 단위 데이터로 채워 하루 시간축의 폭을 고정
    for (let time = session.start; time <= session.end; time += MINUTE) {
      const bar = byTime.get(time);
      const point = { time: (time / 1000) as UTCTimestamp };
      data.push(bar ? { ...point, value: bar.close } : point);
    }
  } else {
    for (const bar of displayedBars)
      data.push({
        time: (Date.parse(bar.timestamp) / 1000) as UTCTimestamp,
        value: bar.close,
      });
  }
  const currentSession = tradingSession(new Date(now).toISOString());
  const isLive =
    usableTick &&
    currentSession.weekday &&
    now >= currentSession.start &&
    now < currentSession.end &&
    now - tickTime < MINUTE;
  return { data, bars: displayedBars, isLive };
}
