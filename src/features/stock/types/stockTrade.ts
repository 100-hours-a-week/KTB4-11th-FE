export type StockTradeSide = "buy" | "sell";
export type StockPriceMode = "limit" | "current" | "market";
export type StockTradeField = "price" | "quantity";
export type StockTradeInputMode = "number" | "orderbook";

export interface StockTradeQuote {
  price: number;
  quantity: number;
  side: "ask" | "bid";
}

export interface StockTradeDemo {
  availableCash: number;
  availableQuantity: number;
  isRegularMarket: boolean;
  quotes: StockTradeQuote[];
}

export type StockTradeResult =
  | {
      type: "success";
      price: number;
      quantity: number;
      priceMode: StockPriceMode;
      pendingNextSession: boolean;
    }
  | { type: "insufficient-cash"; shortfall: number }
  | { type: "insufficient-shares" };

export const STOCK_PRICE_MODE_LABELS: Record<StockPriceMode, string> = {
  limit: "직접 입력",
  current: "현재가",
  market: "시장가",
};

export interface CancelOrderResponse {
  message: string;
  order_id: number;
  order_status: "cancelled";
  canceled_at: string;
}
