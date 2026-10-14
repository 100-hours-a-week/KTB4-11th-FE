import type { CompetitionExecution, DuelTrade } from "@/features/ai/types/duel";
import { formatDateTime } from "@/features/ai/utils/formatDateTime";

export function toDuelTrade(execution: CompetitionExecution): DuelTrade {
  return {
    tradeId: execution.execution_id,
    stockName: execution.stock_name,
    tradeSide: execution.order_side === "buy" ? "매수" : "매도",
    tradeDate: formatDateTime(execution.executed_at),
    quantity: execution.execution_quantity,
    price: Math.round(
      execution.execution_amount / execution.execution_quantity,
    ),
    realizedProfit: execution.realized_profit_amount ?? undefined,
    profitRate: execution.realized_return_percent ?? undefined,
    // 대결 종료 후 화면에서만 쓰여서 이 시점엔 판단 근거가 항상 준비돼 있음 (실제 내용은 /ai/trades/{orderId}에서 조회)
    hasReasoning: true,
    orderId: execution.order_id,
  };
}
