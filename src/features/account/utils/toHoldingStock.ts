import type {
  HoldingApiItem,
  HoldingStock,
} from "@/features/account/types/holdingStock";

export function toHoldingStock(holding: HoldingApiItem): HoldingStock {
  return {
    id: holding.stock_code,
    name: holding.stock_name,
    category: holding.industry_name,
    quantity: holding.quantity,
    avgPrice: holding.average_purchase_price,
    value: holding.total_value,
    changeRate: holding.return_percent,
  };
}
