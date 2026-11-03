export type StockTradeSide = "buy" | "sell";
export type StockPriceMode = "limit" | "current" | "market";
export type StockTradeField = "price" | "quantity";
export type StockTradeInputMode = "number" | "orderbook";

export type StockTradeResult =
  | {
      type: "success";
      price: number;
      quantity: number;
      priceMode: StockPriceMode;
      isFilled: boolean;
      pendingNextSession: boolean;
    }
  | { type: "processing" }
  | { type: "processing-timeout" }
  | { type: "insufficient-cash"; shortfall: number }
  | { type: "insufficient-shares" }
  | { type: "legacy-account" };

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

export type OrderType = "limit" | "market";

export interface CreateOrderRequest {
  stock_code: string;
  stock_name: string;
  order_side: StockTradeSide;
  order_type: OrderType;
  limit_price: number | null;
  quantity: number;
}

export interface CreateOrderAcceptedResponse {
  request_id: string;
  status: "accepted";
}

export interface OrderRequestProcessing {
  status: "pending";
}

export interface OrderRequestCreated {
  status: "created";
  request_id: string;
  order_id: number;
  stock_code: string;
  order_side: StockTradeSide;
  order_type: OrderType;
  order_status: "pending" | "executed";
  quantity: number;
  limit_price: number | null;
  executed_quantity: number;
  execution_price: number | null;
  reason_code: string | null;
}

export type OrderRequestStatus = OrderRequestProcessing | OrderRequestCreated;
