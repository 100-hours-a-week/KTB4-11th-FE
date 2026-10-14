import type { Order } from "@/features/ai/types/aiTrade";
import type { DuelTrade } from "@/features/ai/types/duel";
import { formatDateTime } from "@/features/ai/utils/formatDateTime";

export function toDuelTrade(order: Order): DuelTrade {
  const execution = order.executions[0];

  return {
    tradeId: order.order_id,
    stockName: order.stock_name,
    tradeSide: order.order_side === "buy" ? "매수" : "매도",
    tradeDate: formatDateTime(order.created_at),
    quantity: order.quantity,
    price: execution?.execution_price ?? order.limit_price ?? 0,
    realizedProfit: order.execution_summary?.realized_pnl ?? undefined,
    profitRate: order.execution_summary?.realized_return_percent ?? undefined,
    orderId: order.order_id,
  };
}
