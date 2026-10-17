import type {
  StockHolding,
  StockHoldingResponse,
} from "@/features/stock/types/stockDetail";

export function toStockHolding(holding: StockHoldingResponse): StockHolding {
  return {
    valuationAmount: holding.total_value,
    returnPercent: holding.return_percent,
    quantity: holding.quantity,
    avgPrice: holding.average_purchase_price,
  };
}
