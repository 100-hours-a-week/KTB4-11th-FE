import type { StockTradeDemo } from "@/features/stock/types/stockTrade";

// 정규장: 평일 09:00~15:30 (데모용 간이 판정, 공휴일은 고려하지 않음)
function isRegularMarketHours(now = new Date()): boolean {
  const day = now.getDay();
  if (day === 0 || day === 6) return false;
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes >= 9 * 60 && minutes <= 15 * 60 + 30;
}

// TODO: 시세/호가 실시간 연동 시 교체 (별도 이슈)
export function getStockTradeDemo(price: number): StockTradeDemo {
  return {
    isRegularMarket: isRegularMarketHours(),
    quotes: Array.from({ length: 11 }, (_, index) => ({
      price: price + (5 - index) * 500,
      quantity: [
        1259, 5897, 6752, 4016, 8991, 10486, 1683, 1986, 1731, 2115, 1715,
      ][index],
      side: index <= 5 ? "ask" : "bid",
    })),
  };
}
