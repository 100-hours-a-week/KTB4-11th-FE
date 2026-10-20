import type { Pagination } from "@/shared/types/pagination";
import type { Trade } from "@/shared/types/trade";

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

export interface DuelTrade extends Trade {
  /** AI 거래의 판단 근거가 준비됐는지 (리포트 생성 전이면 false/undefined) */
  hasReasoning?: boolean;
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
  pagination: Pagination;
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

export interface CompetitionParticipant {
  participant_id: number;
  account_id: number;
  participant_type: "user" | "ai";
  display_name: string;
}

export interface CompetitionDetailResponse {
  competition_id: number;
  competition_name: string;
  competition_type: "user_vs_ai";
  state: "in_progress" | "completed";
  start_date: string;
  end_date: string;
  /** 잔여일 (목록 조회와 동일한 의미) */
  d_day: number;
  participants: CompetitionParticipant[];
  cumulative_return_percent: number;
  daily_performances: CompetitionDailyPerformance[];
}

export interface DuelDetail {
  name: string;
  dDay: number;
  accountId: number;
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
  participants: CompetitionParticipant[];
  winner: DuelWinner;
  user_final_return_percent: number;
  ai_final_return_percent: number;
  daily_performances: CompetitionCompareDailyPerformance[];
}

export interface DuelResultSummary {
  name: string;
  startDate: string;
  endDate: string;
  accountId: number;
  aiAccountId: number;
  myReturnPercent: number;
  aiReturnPercent: number;
  result: DuelResult;
  compareHistory: { date: string; myValue: number; aiValue: number }[];
}

export interface CompetitionMarketAnalysis {
  analysis_id: number;
  date: string;
  title: string;
  content: string;
}

export interface CompetitionJudgmentSummary {
  title: string;
  content: string;
}

export interface CompetitionReportResponse {
  competition_id: number;
  competition_name: string;
  start_date: string;
  end_date: string;
  state: string;
  market_analyses: CompetitionMarketAnalysis[];
  judgment_summaries: CompetitionJudgmentSummary[];
}

export interface DuelReportData {
  name: string;
  startDate: string;
  endDate: string;
  isReady: boolean;
  marketEvents: DuelMarketEvent[];
  judgmentClues: DuelJudgmentClue[];
}

export interface CompetitionExecution {
  execution_id: number;
  order_id: number;
  stock_code: string;
  stock_name: string;
  order_side: "buy" | "sell";
  executed_at: string;
  execution_quantity: number;
  execution_amount: number;
  realized_profit_amount: number | null;
  realized_return_percent: number | null;
}

export interface CompetitionExecutionsResponse {
  account_id: number;
  pagination: Pagination;
  executions: CompetitionExecution[];
}

export const DUEL_PERIOD_OPTIONS = [
  "1주",
  "2주",
  "1개월",
  "3개월",
  "다시 입력",
] as const;
export type DuelPeriodOption = (typeof DUEL_PERIOD_OPTIONS)[number];
