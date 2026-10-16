import { StockOrderBook } from "@/features/stock/components/StockOrderBook";
import type { OrderBook } from "@/features/stock/types/stockDetail";
import type { StockTradeQuote } from "@/features/stock/types/stockTrade";

interface StockTradeOrderBookProps {
  quotes: StockTradeQuote[];
  selectedPrice: number;
  currentPrice: number;
  changeRate: number;
  onSelect: (price: number) => void;
}

/** 매매 화면의 호가 데이터를 기존 호가창의 입력 형태로 전달 */
export function StockTradeOrderBook({
  quotes,
  selectedPrice,
  currentPrice,
  changeRate,
  onSelect,
}: StockTradeOrderBookProps) {
  const previousClose = currentPrice / (1 + changeRate / 100);
  // TODO: 종목 시세 API 연동 시 실제 상·하한가로 교체
  const upperLimitPrice = Math.round(previousClose * 1.3);
  const lowerLimitPrice = Math.round(previousClose * 0.7);
  const toLevel = (quote: StockTradeQuote) => ({
    price: quote.price,
    quantity: quote.quantity,
    changeRate: (quote.price / previousClose - 1) * 100,
  });
  const asks = quotes
    .filter((quote) => quote.side === "ask" && quote.price !== currentPrice)
    .map(toLevel)
    .sort((a, b) => a.price - b.price);
  const bids = quotes
    .filter((quote) => quote.side === "bid" && quote.price !== currentPrice)
    .map(toLevel)
    .sort((a, b) => b.price - a.price);
  const orderBook: OrderBook = {
    asks,
    bids,
    currentPrice,
    currentChangeRate: changeRate,
    totalAskQuantity: 0,
    totalBidQuantity: 0,
    isRegularMarket: true,
    upperLimitPrice,
    upperLimitChangeRate: (upperLimitPrice / previousClose - 1) * 100,
    lowerLimitPrice,
    lowerLimitChangeRate: (lowerLimitPrice / previousClose - 1) * 100,
  };
  return (
    <StockOrderBook
      orderBook={orderBook}
      currentQuantity={
        quotes.find((quote) => quote.price === currentPrice)?.quantity
      }
      selectedPrice={selectedPrice}
      onPriceSelect={onSelect}
      showChangeRate={false}
      className="min-h-32 flex-1 bg-transparent [mask-image:linear-gradient(to_bottom,transparent,black_7%,black_93%,transparent)]"
    />
  );
}
