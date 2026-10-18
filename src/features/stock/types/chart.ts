// 봉 데이터와 차트 라벨·십자선 타입

export type BarAggregateUnit = "week" | "month" | "year";

export type BarTimeframe = "1m" | "15m" | "1h" | "1d";

export interface Bar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BarsPage {
  items: Bar[];
  next_cursor: string | null;
}

export interface ChartExtreme {
  key: string;
  x: number;
  y: number;
  text: string;
  high: boolean;
  color: string;
  boundsWidth?: number;
  anchorX?: number;
  anchorY?: number;
  arrow?: boolean;
}

export interface ChartCrosshair {
  x: number;
  y: number;
  price: number;
  date: string;
  width: number;
  height: number;
}
