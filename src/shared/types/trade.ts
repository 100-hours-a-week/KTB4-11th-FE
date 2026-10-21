export type TradeSide = "매도" | "매수";

export interface Trade {
  tradeId: number;
  stockCode: string;
  stockName: string;
  tradeSide: TradeSide;
  tradeDate: string;
  quantity: number;
  price: number;
  /** 매도 체결로 손익이 실현된 경우에만 존재 */
  realizedProfit?: number;
  profitRate?: number;
}
