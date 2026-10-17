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

// 종목 고정 정보(종목명 등) — 실시간 시세는 market 서비스로 덮어씀
export interface StockInfoResponse {
  message: string;
  stock_code: string;
  stock_name: string;
  current_price: number;
  price_change: number;
  price_change_percent: number;
  open_price: number;
  high_price: number;
  low_price: number;
  volume: number;
  fetched_at: string;
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

export interface StockHoldingResponse {
  message: string;
  account_id: number;
  stock_code: string;
  stock_name: string;
  is_held: boolean;
  quantity: number;
  total_cost: number;
  average_purchase_price: number;
  current_price: number;
  total_value: number;
  unrealized_pnl: number;
  return_percent: number;
  fetched_at: string;
}

export type PendingOrderSide = "구매 예약" | "판매 예약";

export interface PendingOrder {
  orderId: number;
  side: PendingOrderSide;
  date: string;
  quantity: number;
  price: number;
}
