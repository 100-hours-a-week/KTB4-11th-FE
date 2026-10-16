import type {
  StockPriceMode,
  StockTradeDemo,
  StockTradeResult,
  StockTradeSide,
} from "@/features/stock/types/stockTrade";

export function appendTradeDigit(value: string, key: string): string {
  const digits = `${value}${key}`.replace(/^0+/, "");
  return digits.slice(0, 9);
}

// UI 데모용 결과 판정 (실제 접수·체결 결과는 주문 API 응답으로 대체)
export function getDemoTradeResult({
  side,
  priceMode,
  price,
  quantity,
  demo,
}: {
  side: StockTradeSide;
  priceMode: StockPriceMode;
  price: number;
  quantity: number;
  demo: StockTradeDemo;
}): StockTradeResult {
  if (priceMode === "market" && !demo.isRegularMarket)
    return { type: "market-closed" };
  if (side === "sell" && quantity > demo.availableQuantity)
    return { type: "insufficient-shares" };
  const shortfall = price * quantity - demo.availableCash;
  if (side === "buy" && shortfall > 0)
    return { type: "insufficient-cash", shortfall };
  return { type: "success", price, quantity, priceMode };
}
