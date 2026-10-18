import type {
  MarketOrderBook,
  MarketOrderBookLevel,
} from "@/features/stock/types/market";
import type {
  OrderBook,
  OrderBookLevel,
} from "@/features/stock/types/stockDetail";
import { getPriceLimits } from "@/features/stock/utils/stockTrade";

export function toOrderBook(
  marketOrderBook: MarketOrderBook,
  currentPrice: number,
  currentChangeRate: number,
  isRegularMarket: boolean,
): OrderBook {
  const previousClose = currentPrice / (1 + currentChangeRate / 100);
  const toChangeRate = (price: number) => (price / previousClose - 1) * 100;
  const toLevel = (level: MarketOrderBookLevel): OrderBookLevel => ({
    price: level.price,
    changeRate: toChangeRate(level.price),
    quantity: level.qty,
  });

  const { upperLimitPrice, lowerLimitPrice } = getPriceLimits(
    currentPrice,
    currentChangeRate,
  );

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
    upperLimitChangeRate: toChangeRate(upperLimitPrice),
    lowerLimitPrice,
    lowerLimitChangeRate: toChangeRate(lowerLimitPrice),
  };
}
