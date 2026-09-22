export interface HoldingStock {
  id: string;
  name: string;
  category: string;
  quantity: number;
  avgPrice: number;
  value: number;
  changeRate: number;
}

export type HoldingsSort = "latest_purchase" | "return_rate" | "market_value";

export interface HoldingsQueryParams {
  sort?: HoldingsSort;
  order?: "asc" | "desc";
  limit?: number;
}

export interface HoldingApiItem {
  stock_code: string;
  stock_name: string;
  industry_name: string;
  quantity: number;
  total_cost_basis: number;
  average_purchase_price: number;
  current_price: number;
  total_value: number;
  unrealized_pnl: number;
  return_percent: number;
}

export interface HoldingsResponse {
  message: string;
  account_id: number;
  holdings: HoldingApiItem[];
}
