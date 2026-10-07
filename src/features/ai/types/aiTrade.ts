export interface AiTrade {
  orderId: number;
  stockName: string;
  tradeType: "매도" | "매수";
  tradeDate: string;
  quantity: number;
  price: number;
  reasoning: string;
  realizedProfit: number;
  profitRate: number;
}

export type OrderSide = "buy" | "sell";
export type OrderType = "limit" | "market";
export type OrderStatus = "pending" | "executed" | "cancelled";

export interface OrderExecution {
  execution_id: number;
  execution_price: number;
  execution_quantity: number;
  realized_pnl: number | null;
  realized_return_percent: number | null;
  created_at: string;
}

export interface OrderExecutionSummary {
  quantity: number;
  average_price: number;
  total_amount: number;
  executed_at: string;
  realized_pnl: number | null;
  realized_return_percent: number | null;
}

export interface Order {
  order_id: number;
  stock_code: string;
  stock_name: string;
  order_source: "user" | "ai";
  order_side: OrderSide;
  order_type: OrderType;
  order_status: OrderStatus;
  quantity: number;
  limit_price: number | null;
  reserved_cash: number;
  created_at: string;
  canceled_at: string | null;
  reason: { summary: string | null } | null;
  executions: OrderExecution[];
  execution_summary: OrderExecutionSummary | null;
  can_cancel: boolean;
}

export interface OrdersResponse {
  message: string;
  account_id: number;
  orders: Order[];
}
