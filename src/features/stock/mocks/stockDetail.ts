import type { Trade } from "@/shared/types/trade";
import type {
  OrderBook,
  PendingOrder,
  StockDetailInfo,
  StockHolding,
} from "@/features/stock/types/stockDetail";

// TODO : 종목 상세 API 연동 시 제거 (별도 이슈)
export const DEMO_STOCK_INFO: Record<string, StockDetailInfo> = {
  "035420": {
    stockCode: "035420",
    name: "NAVER",
    price: 221_500,
    changeAmount: -2_000,
    changeRate: -0.8,
    isFavorite: true,
  },
  "005930": {
    stockCode: "005930",
    name: "삼성전자",
    price: 74_100,
    changeAmount: 1_200,
    changeRate: 1.6,
    isFavorite: false,
  },
};

export const DEMO_HOLDING_STOCK_CODES = new Set(["035420"]);

export const DEMO_ORDER_BOOK: OrderBook = {
  asks: [
    { price: 224_500, changeRate: 1.69, quantity: 189_425 },
    { price: 224_000, changeRate: 3.5, quantity: 143_101 },
    { price: 223_500, changeRate: 3.3, quantity: 170_724 },
    { price: 223_000, changeRate: 3.11, quantity: 133_732 },
    { price: 222_000, changeRate: 2.72, quantity: 211_722 },
  ],
  currentPrice: 221_500,
  currentChangeRate: -0.8,
  bids: [
    { price: 221_000, changeRate: 1.94, quantity: 62_898 },
    { price: 220_500, changeRate: 1.75, quantity: 72_880 },
    { price: 220_000, changeRate: 1.55, quantity: 59_818 },
    { price: 219_500, changeRate: 1.36, quantity: 52_572 },
    { price: 219_000, changeRate: 1.16, quantity: 67_468 },
  ],
  totalAskQuantity: 1_589_930,
  totalBidQuantity: 586_470,
  isRegularMarket: true,
  upperLimitPrice: 290_500,
  upperLimitChangeRate: 29.98,
  lowerLimitPrice: 156_500,
  lowerLimitChangeRate: -29.98,
};

export const DEMO_HOLDING: StockHolding = {
  valuationAmount: 886_000,
  returnPercent: -0.7,
  quantity: 4,
  avgPrice: 223_000,
};

export const DEMO_PENDING_ORDERS: PendingOrder[] = [
  {
    orderId: 1,
    side: "구매 예약",
    date: "2026.08.25 09:41",
    quantity: 3,
    price: 220_000,
  },
  {
    orderId: 2,
    side: "판매 예약",
    date: "2026.08.25 10:02",
    quantity: 1,
    price: 225_000,
  },
];

export const DEMO_ORDER_HISTORY: Trade[] = [
  {
    tradeId: 101,
    stockName: "NAVER",
    tradeDate: "2026.08.26 09:32",
    tradeSide: "매수",
    quantity: 2,
    price: 223_000,
  },
  {
    tradeId: 102,
    stockName: "NAVER",
    tradeDate: "2026.08.20 10:15",
    tradeSide: "매수",
    quantity: 3,
    price: 221_000,
  },
  {
    tradeId: 103,
    stockName: "NAVER",
    tradeDate: "2026.08.18 13:47",
    tradeSide: "매도",
    quantity: 1,
    price: 219_500,
    realizedProfit: -1_500,
    profitRate: -0.7,
  },
];
