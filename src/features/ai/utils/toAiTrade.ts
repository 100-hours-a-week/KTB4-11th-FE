import type { AiTrade, Order } from "@/features/ai/types/aiTrade";
import { formatDateTime } from "@/features/ai/utils/formatDateTime";

export function toAiTrade(order: Order): AiTrade {
  const execution = order.executions[0];

  return {
    orderId: order.order_id,
    stockName: order.stock_name,
    tradeType: order.order_side === "buy" ? "매수" : "매도",
    tradeDate: formatDateTime(order.created_at),
    quantity: order.quantity,
    price: execution?.execution_price ?? order.limit_price ?? 0,
    reasoning: order.summary ?? "AI 판단 근거를 준비하고 있어요",
    realizedProfit: order.realized_pnl ?? 0,
    profitRate: order.realized_return_percent ?? 0,
  };
}
