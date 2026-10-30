import { StockOrderBook } from "@/features/stock/components/StockOrderBook";
import type { OrderBook } from "@/features/stock/types/stockDetail";

interface StockTradeOrderBookProps {
  orderBook: OrderBook;
  selectedPrice: number;
  onSelect: (price: number) => void;
}

// 매매 화면의 호가 선택기 — 종목 상세의 호가창과 동일한 데이터·컴포넌트를 재사용
export function StockTradeOrderBook({
  orderBook,
  selectedPrice,
  onSelect,
}: StockTradeOrderBookProps) {
  return (
    <StockOrderBook
      orderBook={orderBook}
      selectedPrice={selectedPrice}
      onPriceSelect={onSelect}
      showChangeRate={false}
      className="min-h-32 flex-1 bg-transparent [mask-image:linear-gradient(to_bottom,transparent,black_7%,black_93%,transparent)]"
    />
  );
}
