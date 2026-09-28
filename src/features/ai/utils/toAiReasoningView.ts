import type {
  AiJudgmentStep,
  AiReasoningSummaryItem,
  AiReportResponse,
} from "@/features/ai/types/aiTradeReasoning";
import { formatDateTime } from "@/features/ai/utils/formatDateTime";
import CartIcon from "@/assets/icons/fill/cart.svg";
import FlameIcon from "@/assets/icons/fill/flame.svg";
import HandCoinsIcon from "@/assets/icons/fill/hand-coins.svg";
import TrendIcon from "@/assets/icons/fill/trend.svg";

function withSign(value: number) {
  return value >= 0 ? `+${value}` : `${value}`;
}

export function toBuyReasoningTitle(report: AiReportResponse) {
  const decisionCount = report.buy_analysis?.decision_steps.length ?? 0;

  return {
    title: `${report.stock_name}를 매수한 이유`,
    meta: `${formatDateTime(report.decided_at)} · 의사결정 ${decisionCount}건`,
  };
}

export function toBuyExecutionResult(
  report: AiReportResponse,
): AiReasoningSummaryItem[] {
  const { execution, buy_analysis } = report;

  return [
    { label: "종목", value: `${report.stock_name} (${report.stock_code})` },
    {
      label: "체결 가격 · 수량",
      value: `${execution.execution_price.toLocaleString()}원 · ${execution.execution_quantity}주`,
    },
    {
      label: "총 거래 금액",
      value: `${execution.trade_amount.toLocaleString()}원`,
    },
    {
      label: "거래 후 비중",
      value: `${buy_analysis?.holding_weight_after_trade_percent}% (상한 ${buy_analysis?.holding_weight_limit_percent}%)`,
    },
  ];
}

export function toJudgmentFlow(report: AiReportResponse): AiJudgmentStep[] {
  return (report.buy_analysis?.decision_steps ?? []).map((step) => ({
    id: `step-${step.step}`,
    title: step.title,
    details: step.items,
  }));
}

export function toSellReasoningTitle(report: AiReportResponse) {
  return {
    title: `${report.stock_name}를 매도한 이유`,
    meta: `${formatDateTime(report.decided_at)} · 보유 ${report.sell_analysis?.trade_result.holding_days}일`,
  };
}

export function toSellExecutionResult(
  report: AiReportResponse,
): AiReasoningSummaryItem[] {
  const sellAnalysis = report.sell_analysis;
  if (!sellAnalysis) return [];

  const { trade_result } = sellAnalysis;

  return [
    {
      label: "매수가 → 매도가",
      value: `${trade_result.average_buy_price.toLocaleString()} → ${report.execution.execution_price.toLocaleString()}원`,
    },
    {
      label: "실현손익",
      value: `${withSign(trade_result.realized_pnl)}원 · ${withSign(trade_result.realized_return_percent)}%`,
    },
    {
      label: "목표 수익률 도달",
      value: `${trade_result.target_reached ? "도달" : "미도달"} (+${trade_result.target_return_percent}% 기준)`,
    },
    {
      label: "손실 제한",
      value: trade_result.stop_loss_triggered ? "발동함" : "발동하지 않음",
    },
  ];
}

export function toFromBuyToSell(
  report: AiReportResponse,
): AiReasoningSummaryItem[] {
  const sellAnalysis = report.sell_analysis;
  if (!sellAnalysis) return [];

  const {
    buy_decision,
    holding_changes,
    sell_decision,
    expectation_vs_outcome,
  } = sellAnalysis;

  return [
    { label: "매수 당시 판단", value: buy_decision.summary, icon: CartIcon },
    ...holding_changes.map((change) => ({
      label: "보유 중 변화",
      value: change.summary,
      icon: TrendIcon,
    })),
    { label: "매도 판단", value: sell_decision, icon: HandCoinsIcon },
    {
      label: "처음 예상과 결과",
      value: `예상 ${expectation_vs_outcome.expected_return_min_percent}~${expectation_vs_outcome.expected_return_max_percent}% · 실제 ${withSign(sellAnalysis.trade_result.realized_return_percent)}%`,
      icon: FlameIcon,
    },
  ];
}
