import { TradeCard } from "@/shared/components/TradeCard";
import type { Trade } from "@/shared/types/trade";

interface StockOrderHistoryListProps {
  items: Trade[];
}

export function StockOrderHistoryList({ items }: StockOrderHistoryListProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="body-1-bold px-1">주문 내역</span>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <TradeCard key={item.tradeId} {...item} />
        ))}
      </div>
    </div>
  );
}
