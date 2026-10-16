export const STOCK_DETAIL_TABS_WITH_HOLDING = [
  "차트",
  "호가",
  "내 주식",
] as const;
export const STOCK_DETAIL_TABS_WITHOUT_HOLDING = ["차트", "호가"] as const;
export type StockDetailTab =
  | (typeof STOCK_DETAIL_TABS_WITH_HOLDING)[number]
  | (typeof STOCK_DETAIL_TABS_WITHOUT_HOLDING)[number];

export const CHART_PERIODS = [
  "1일",
  "1주",
  "3달",
  "1년",
  "5년",
  "전체",
] as const;
export type ChartPeriod = (typeof CHART_PERIODS)[number];

export interface StockDetailInfo {
  stockCode: string;
  name: string;
  price: number;
  changeAmount: number;
  changeRate: number;
  isFavorite: boolean;
}

export interface OrderBookLevel {
  price: number;
  changeRate: number;
  quantity: number;
}

export interface OrderBook {
  asks: OrderBookLevel[];
  currentPrice: number;
  currentChangeRate: number;
  bids: OrderBookLevel[];
  totalAskQuantity: number;
  totalBidQuantity: number;
  isRegularMarket: boolean;
  upperLimitPrice: number;
  upperLimitChangeRate: number;
  lowerLimitPrice: number;
  lowerLimitChangeRate: number;
}

export interface StockHolding {
  valuationAmount: number;
  returnPercent: number;
  quantity: number;
  avgPrice: number;
}

export type PendingOrderSide = "구매 예약" | "판매 예약";

export interface PendingOrder {
  orderId: number;
  side: PendingOrderSide;
  date: string;
  quantity: number;
  price: number;
}
