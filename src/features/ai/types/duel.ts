export const DUEL_TYPES = ["나 vs AI", "AI끼리"] as const;
export type DuelType = (typeof DUEL_TYPES)[number];

export const DUEL_STATUS_FILTERS = ["전체", "진행 중", "지난 대결"] as const;
export type DuelStatusFilter = (typeof DUEL_STATUS_FILTERS)[number];

export type DuelStatus = "진행 중" | "종료";

export type DuelResult = "WIN" | "LOSE";

export interface Duel {
  id: string;
  name: string;
  type: DuelType;
  status: DuelStatus;
  startDate: string;
  endDate: string;
  dDay: number;
  stockCount: number;
  returnPercent: number;
  /** AI끼리 대결 종료 시 우승 전략명 */
  winner?: string;
  /** 나 vs AI 대결 종료 시 결과 (나 기준) */
  result?: DuelResult;
}

export interface DuelHolding {
  stockCode: string;
  stockName: string;
  category: string;
  weightPercent: number;
  quantity: number;
  avgPrice: number;
  value: number;
  profitAmount: number;
  returnPercent: number;
}

export type DuelTradeSide = "매도" | "매수";

export interface DuelTrade {
  tradeId: number;
  stockName: string;
  tradeSide: DuelTradeSide;
  tradeDate: string;
  quantity: number;
  price: number;
  /** 매도 체결로 손익이 실현된 경우에만 존재 */
  realizedProfit?: number;
  profitRate?: number;
  /** AI 거래의 한 줄 판단 (리포트 생성 전이면 아직 없음) */
  reasoning?: string;
  orderId?: number;
}

export interface DuelMarketEvent {
  date: string;
  title: string;
  body: string;
}

export interface DuelJudgmentClue {
  title: string;
  description: string;
}

export const DUEL_PERIOD_OPTIONS = [
  "1주",
  "2주",
  "1개월",
  "3개월",
  "다시 입력",
] as const;
export type DuelPeriodOption = (typeof DUEL_PERIOD_OPTIONS)[number];
