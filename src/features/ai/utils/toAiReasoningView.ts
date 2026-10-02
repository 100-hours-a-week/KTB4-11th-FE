import type {
  AiReasoningSummaryItem,
  AiReportResponse,
} from "@/features/ai/types/aiTradeReasoning";
import { formatDateTime } from "@/features/ai/utils/formatDateTime";

function withSign(value: number) {
  return value >= 0 ? `+${value}` : `${value}`;
}

export function toReasoningTitle(report: AiReportResponse) {
  const isBuy = report.order_side === "buy";

  return {
    title: `${report.stock_name}를 ${isBuy ? "매수" : "매도"}한 이유`,
    date: formatDateTime(report.execution.executed_at),
    holdingDays: isBuy ? undefined : report.sell_result?.holding_days,
  };
}

export function toExecutionResult(
  report: AiReportResponse,
): AiReasoningSummaryItem[] {
  const { execution } = report;

  if (report.order_side === "buy") {
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
        value: `${report.holding_weight_after_trade_percent}% (상한 ${report.holding_weight_limit_percent}%)`,
      },
    ];
  }

  const sellResult = report.sell_result;
  if (!sellResult) return [];

  return [
    {
      label: "매수가 → 매도가",
      value: `${sellResult.average_buy_price.toLocaleString()} → ${execution.execution_price.toLocaleString()}원`,
    },
    {
      label: "실현손익",
      value: `${sellResult.realized_pnl >= 0 ? "+" : ""}${sellResult.realized_pnl.toLocaleString()}원 · ${withSign(sellResult.realized_return_percent)}%`,
    },
    {
      label: "목표 수익률 도달",
      value: `${sellResult.target_reached ? "도달" : "미도달"} (+${sellResult.target_return_percent}% 기준)`,
    },
    {
      label: "손실 제한",
      value: sellResult.stop_loss_triggered ? "발동함" : "발동하지 않음",
    },
  ];
}
