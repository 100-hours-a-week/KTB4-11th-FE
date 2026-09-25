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

export interface AiBuyReasoning {
  stockName: string;
  tradeDate: string;
  decisionCount: number;
  executionCount: number;
  oneLineJudgment: string;
  executionResult: AiReasoningSummaryItem[];
  judgmentFlow: AiJudgmentStep[];
}

export interface AiSellReasoning {
  stockName: string;
  tradeDate: string;
  holdingDays: number;
  oneLineJudgment: string;
  summary: AiReasoningSummaryItem[];
  fromBuyToSell: AiReasoningSummaryItem[];
}
