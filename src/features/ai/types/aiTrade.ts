export interface AiTrade {
  stockName: string;
  tradeType: "매도" | "매수";
  tradeDate: string;
  quantity: number;
  price: number;
  reasoning: string;
  realizedProfit: number;
  profitRate: number;
}
