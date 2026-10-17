import type { Order } from "@/features/ai/types/aiTrade";
import { formatDateTime } from "@/features/ai/utils/formatDateTime";
import type { PendingOrder } from "@/features/stock/types/stockDetail";

export function toPendingOrder(order: Order): PendingOrder {
  return {
    orderId: order.order_id,
    side: order.order_side === "buy" ? "구매 예약" : "판매 예약",
    date: formatDateTime(order.created_at),
    quantity: order.quantity,
    price: order.limit_price ?? 0,
  };
}
