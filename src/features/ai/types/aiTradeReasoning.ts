import type { ComponentType } from "react";

export interface AiReasoningSummaryItem {
  label: string;
  value: string;
  icon?: ComponentType<{ width?: number; height?: number; className?: string }>;
}

export interface AiJudgmentStep {
  id: string;
  title: string;
  details?: AiReasoningSummaryItem[];
}

export interface DecisionStepItem {
  label: string;
  value: string;
}

export interface DecisionStep {
  step: number;
  title: string;
  items: DecisionStepItem[];
}

export interface BuyAnalysis {
  holding_weight_after_trade_percent: number;
  holding_weight_limit_percent: number;
  decision_steps: DecisionStep[];
}

export interface SellTradeResult {
  average_buy_price: number;
  holding_days: number;
  realized_pnl: number;
  realized_return_percent: number;
  target_return_percent: number;
  target_reached: boolean;
  stop_loss_triggered: boolean;
}

export interface SellBuyDecision {
  buy_report_id: number;
  summary: string;
}

export interface SellHoldingChange {
  observed_at: string;
  summary: string;
}

export interface SellExpectationVsOutcome {
  expected_return_min_percent: number;
  expected_return_max_percent: number;
  summary: string;
}

export interface SellAnalysis {
  trade_result: SellTradeResult;
  buy_decision: SellBuyDecision;
  holding_changes: SellHoldingChange[];
  sell_decision: string;
  expectation_vs_outcome: SellExpectationVsOutcome;
}

export interface AiReportExecution {
  executed_at: string;
  execution_price: number;
  execution_quantity: number;
  trade_amount: number;
}

export interface AiReportResponse {
  message: string;
  report_id: number;
  order_id: number;
  order_side: "buy" | "sell";
  stock_code: string;
  stock_name: string;
  report_status: "completed";
  decided_at: string;
  execution: AiReportExecution;
  summary: string;
  buy_analysis: BuyAnalysis | null;
  sell_analysis: SellAnalysis | null;
}
