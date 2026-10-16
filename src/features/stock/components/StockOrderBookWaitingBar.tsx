import type { OrderBook } from "@/features/stock/types/stockDetail";

interface StockOrderBookWaitingBarProps {
  orderBook: OrderBook;
}

export function StockOrderBookWaitingBar({
  orderBook,
}: StockOrderBookWaitingBarProps) {
  return (
    <div className="bg-bg-layer-basement grid grid-cols-3 items-center px-5 py-4">
      <span className="caption-1-regular text-text-neutral-secondary flex flex-col items-center gap-1">
        판매 대기
        <span className="body-1-semibold text-text-price-fall">
          {orderBook.totalAskQuantity.toLocaleString()}
        </span>
      </span>
      <span className="body-1-semibold text-text-neutral-secondary text-center">
        {orderBook.isRegularMarket ? "정규장" : "장 마감"}
      </span>
      <span className="caption-1-regular text-text-neutral-secondary flex flex-col items-center gap-1">
        구매 대기
        <span className="body-1-semibold text-text-price-rise">
          {orderBook.totalBidQuantity.toLocaleString()}
        </span>
      </span>
    </div>
  );
}
