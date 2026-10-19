export interface MarketPrice {
  code: string;
  price: number;
  change: number;
  rate: number;
  volume: number;
  timestamp: string;
  upper_limit_price: number;
  lower_limit_price: number;
}

export interface MarketOrderBookLevel {
  price: number;
  qty: number;
}

export interface MarketOrderBook {
  code: string;
  asks: MarketOrderBookLevel[];
  bids: MarketOrderBookLevel[];
  timestamp: string;
}

export type MarketPriceTick = Omit<
  MarketPrice,
  "upper_limit_price" | "lower_limit_price"
> &
  Partial<Pick<MarketPrice, "upper_limit_price" | "lower_limit_price">>;
