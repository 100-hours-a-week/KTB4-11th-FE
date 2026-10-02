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
  const dateText = formatDateTime(report.execution.executed_at);

  return {
    title: `${report.stock_name}를 ${isBuy ? "매수" : "매도"}한 이유`,
    meta: isBuy
      ? dateText
      : `${dateText} · 보유 ${report.trade_result?.holding_days}일`,
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

  const tradeResult = report.trade_result;
  if (!tradeResult) return [];

  return [
    {
      label: "매수가 → 매도가",
      value: `${tradeResult.average_buy_price.toLocaleString()} → ${execution.execution_price.toLocaleString()}원`,
    },
    {
      label: "실현손익",
      value: `${tradeResult.realized_pnl >= 0 ? "+" : ""}${tradeResult.realized_pnl.toLocaleString()}원 · ${withSign(tradeResult.realized_return_percent)}%`,
    },
    {
      label: "목표 수익률 도달",
      value: `${tradeResult.target_reached ? "도달" : "미도달"} (+${tradeResult.target_return_percent}% 기준)`,
    },
    {
      label: "손실 제한",
      value: tradeResult.stop_loss_triggered ? "발동함" : "발동하지 않음",
    },
  ];
}
