import type { PendingOrder } from "@/features/stock/types/stockDetail";

interface StockPendingOrderListProps {
  orders: PendingOrder[];
  onCancel?: (orderId: number) => void;
}

export function StockPendingOrderList({
  orders,
  onCancel,
}: StockPendingOrderListProps) {
  if (orders.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="body-1-bold px-1">대기 중인 주문</span>
      <div className="bg-bg-layer-default divide-border-neutral-muted flex flex-col divide-y rounded-2xl px-4">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="flex items-center justify-between py-3"
          >
            <div className="flex flex-col gap-0.5">
              <span className="body-2-semibold">{order.side}</span>
              <span className="caption-1-regular text-text-neutral-secondary flex items-center">
                {order.date}
                <span className="bg-border-neutral-muted mx-1.5 h-3 w-px" />
                {order.quantity}주
                <span className="bg-border-neutral-muted mx-1.5 h-3 w-px" />
                {order.price.toLocaleString()}원
              </span>
            </div>
            <button
              type="button"
              onClick={() => onCancel?.(order.orderId)}
              className="caption-1-semibold text-text-neutral-tertiary"
            >
              취소
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
