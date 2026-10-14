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

/** 진행 중이면 null, 완료되면 "user"(내 승리) 또는 "ai"(AI 승리) */
export type DuelWinner = "user" | "ai" | null;

export interface CompetitionApiItem {
  competition_id: number;
  state: "in_progress" | "completed";
  competition_name: string;
  competition_type: "user_vs_ai";
  start_date: string;
  end_date: string;
  d_day: number;
  cumulative_return_percent: number;
  winner: DuelWinner;
}

export interface CompetitionsResponse {
  ongoing_competition_count: number;
  competitions: CompetitionApiItem[];
}

export interface CreateCompetitionRequest {
  competition_name: string;
  competition_type: "user_vs_ai";
  start_date: string;
  end_date: string;
  initial_capital: number;
}

export interface CreateCompetitionResponse {
  message: string;
  competition_id: number;
  d_day: number;
}

export interface CompetitionDailyPerformance {
  date: string;
  cumulative_return_percent: number;
}

export interface CompetitionDetailResponse {
  competition_id: number;
  competition_name: string;
  competition_type: "user_vs_ai";
  state: "in_progress" | "completed";
  start_date: string;
  end_date: string;
  /** 잔여일이 아니라 대결 전체 기간 길이 (잔여일 통일 요청함) */
  d_day: number;
  remaining_days: number;
  cumulative_return_percent: number;
  daily_performances: CompetitionDailyPerformance[];
  as_of: string;
}

export interface DuelDetail {
  name: string;
  dDay: number;
  myReturnPercent: number;
  returnHistory: { date: string; value: number }[];
}

export interface CompetitionCompareDailyPerformance {
  date: string;
  user_cumulative_return_percent: number;
  ai_cumulative_return_percent: number;
}

export interface CompetitionResultResponse {
  competition_id: number;
  competition_name: string;
  competition_type: "user_vs_ai";
  state: "completed";
  start_date: string;
  end_date: string;
  d_day: number | null;
  winner: DuelWinner;
  user_final_return_percent: number;
  ai_final_return_percent: number;
  daily_performances: CompetitionCompareDailyPerformance[];
}

export interface DuelResultSummary {
  name: string;
  startDate: string;
  endDate: string;
  myReturnPercent: number;
  aiReturnPercent: number;
  result: DuelResult;
  compareHistory: { date: string; myValue: number; aiValue: number }[];
}

export const DUEL_PERIOD_OPTIONS = [
  "1주",
  "2주",
  "1개월",
  "3개월",
  "다시 입력",
] as const;
export type DuelPeriodOption = (typeof DUEL_PERIOD_OPTIONS)[number];
