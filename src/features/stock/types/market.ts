export interface MarketPrice {
  code: string;
  price: number;
  change: number;
  rate: number;
  volume: number;
  timestamp: string;
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
