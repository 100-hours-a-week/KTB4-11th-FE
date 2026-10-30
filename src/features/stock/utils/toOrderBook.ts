import type {
  MarketOrderBook,
  MarketOrderBookLevel,
  MarketPriceTick,
} from "@/features/stock/types/market";
import type {
  OrderBook,
  OrderBookLevel,
} from "@/features/stock/types/stockDetail";

export function toOrderBook(
  marketOrderBook: MarketOrderBook,
  currentPrice: number,
  currentChangeRate: number,
  isRegularMarket: boolean,
  marketPrice: MarketPriceTick | null,
): OrderBook {
  const previousClose = currentPrice / (1 + currentChangeRate / 100);
  const toChangeRate = (price: number) => (price / previousClose - 1) * 100;
  const toLevel = (level: MarketOrderBookLevel): OrderBookLevel => ({
    price: level.price,
    changeRate: toChangeRate(level.price),
    quantity: level.qty,
  });

  const upperLimitPrice = marketPrice?.upper_limit_price;
  const lowerLimitPrice = marketPrice?.lower_limit_price;

  return {
    asks: marketOrderBook.asks.map(toLevel),
    bids: marketOrderBook.bids.map(toLevel),
    currentPrice,
    currentChangeRate,
    totalAskQuantity: marketOrderBook.asks.reduce(
      (sum, level) => sum + level.qty,
      0,
    ),
    totalBidQuantity: marketOrderBook.bids.reduce(
      (sum, level) => sum + level.qty,
      0,
    ),
    isRegularMarket,
    upperLimitPrice,
    upperLimitChangeRate: upperLimitPrice
      ? toChangeRate(upperLimitPrice)
      : undefined,
    lowerLimitPrice,
    lowerLimitChangeRate: lowerLimitPrice
      ? toChangeRate(lowerLimitPrice)
      : undefined,
  };
}
