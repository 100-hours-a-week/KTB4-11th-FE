import type { Order } from "@/features/ai/types/aiTrade";
import { formatDateTime } from "@/features/ai/utils/formatDateTime";
import type { Trade } from "@/shared/types/trade";

export function toStockTrade(order: Order): Trade {
  const summary = order.execution_summary;

  return {
    tradeId: order.order_id,
    stockCode: order.stock_code,
    stockName: order.stock_name,
    tradeSide: order.order_side === "buy" ? "매수" : "매도",
    tradeDate: formatDateTime(summary?.executed_at ?? order.created_at),
    quantity: summary?.quantity ?? order.quantity,
    price: summary?.average_price ?? order.limit_price ?? 0,
    realizedProfit: summary?.realized_pnl ?? undefined,
    profitRate: summary?.realized_return_percent ?? undefined,
  };
}
