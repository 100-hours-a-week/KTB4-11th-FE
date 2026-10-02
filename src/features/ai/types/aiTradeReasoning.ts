import type { ComponentType } from "react";

export interface AiReasoningSummaryItem {
  label: string;
  value: string;
  icon?: ComponentType<{ width?: number; height?: number; className?: string }>;
}

export interface AiReasoningItem {
  label: string;
  body: string;
}

export interface AiReportExecution {
  executed_at: string;
  execution_price: number;
  execution_quantity: number;
  trade_amount: number;
}

export interface AiTradeResult {
  holding_days: number;
  average_buy_price: number;
  realized_pnl: number;
  realized_return_percent: number;
  target_return_percent: number;
  target_reached: boolean;
  stop_loss_triggered: boolean;
}

export interface AiReportResponse {
  order_id: number;
  order_side: "buy" | "sell";
  stock_code: string;
  stock_name: string;
  execution: AiReportExecution;
  reason: string;
  reasoning: AiReasoningItem[];
  holding_weight_after_trade_percent?: number;
  holding_weight_limit_percent?: number;
  trade_result?: AiTradeResult;
}
