import type {
  StockHolding,
  StockHoldingResponse,
} from "@/features/stock/types/stockDetail";

export function toStockHolding(
  holding: StockHoldingResponse,
  currentPrice: number,
): StockHolding {
  const valuationAmount = holding.quantity * currentPrice;
  const returnPercent =
    holding.total_cost > 0
      ? ((valuationAmount - holding.total_cost) / holding.total_cost) * 100
      : 0;

  return {
    valuationAmount,
    returnPercent,
    quantity: holding.quantity,
    avgPrice: holding.average_purchase_price,
  };
}
