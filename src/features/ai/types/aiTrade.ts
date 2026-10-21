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

export interface OrdersPagination {
  page: number;
  limit: number;
  total_elements: number;
  total_pages: number;
  has_next: boolean;
}

export interface OrdersResponse {
  account_id: number;
  pagination?: OrdersPagination;
  orders: Order[];
}

export interface PaginatedOrdersResponse extends OrdersResponse {
  pagination: OrdersPagination;
}
