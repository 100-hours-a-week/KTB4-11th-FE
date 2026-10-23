// KRX 호가가격단위 (가격 구간별 최소 호가 단위)
const TICK_SIZE_TABLE: [upperBound: number, tick: number][] = [
  [2_000, 1],
  [5_000, 5],
  [20_000, 10],
  [50_000, 50],
  [200_000, 100],
  [500_000, 500],
  [Infinity, 1_000],
];

export function getTickSize(price: number): number {
  const entry = TICK_SIZE_TABLE.find(([upperBound]) => price < upperBound);
  return entry ? entry[1] : TICK_SIZE_TABLE[TICK_SIZE_TABLE.length - 1][1];
}

export function roundToTickSize(price: number): number {
  const tick = getTickSize(price);
  return Math.round(price / tick) * tick;
}
