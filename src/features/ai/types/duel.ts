import type { Trade } from "@/shared/types/trade";

export const DUEL_TYPES = ["나 vs AI", "AI끼리"] as const;
export type DuelType = (typeof DUEL_TYPES)[number];

export const DUEL_STATUS_FILTERS = ["전체", "진행 중", "지난 대결"] as const;
export type DuelStatusFilter = (typeof DUEL_STATUS_FILTERS)[number];

export type DuelStatus = "시작 대기" | "진행 중" | "종료" | "취소";
export type CompetitionState =
  "ready" | "in_progress" | "completed" | "cancelled";

export type DuelResult = "WIN" | "LOSE" | "DRAW";

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

/** 진행 중이면 null, 완료되면 "user"(내 승리)/"ai"(AI 승리)/"draw"(무승부) */
export type DuelWinner = "user" | "ai" | "draw" | null;

export interface CompetitionApiItem {
  competition_id: number;
  state: CompetitionState;
  competition_name: string;
  competition_type: "user_vs_ai" | "ai_vs_ai";
  start_date: string;
  end_date: string;
  d_day: number;
  cumulative_return_percent: number;
  winner: DuelWinner;
}

export interface CompetitionsPagination {
  limit: number;
  has_next: boolean;
  next_cursor: string | null;
}

export interface CompetitionsResponse {
  ongoing_competition_count: number;
  pagination: CompetitionsPagination;
  competitions: CompetitionApiItem[];
}

export interface AiAgentSettingRequest {
  risk_level: 1 | 2 | 3 | 4 | 5;
  preferred_themes: string[];
  excluded_themes: string[];
  additional_request: string;
}

export interface CreateCompetitionRequest {
  competition_name: string;
  competition_type: "user_vs_ai" | "ai_vs_ai";
  start_date: string;
  end_date: string;
  initial_capital: number;
  ai_participant_count?: number;
  agents?: AiAgentSettingRequest[];
}

export interface CreateCompetitionResponse {
  message: string;
  competition_id: number;
  state: CompetitionState;
}

export interface CompetitionNameAvailabilityResponse {
  competition_name: string;
  available: boolean;
}

export interface CancelCompetitionResponse {
  competition_id: number;
  state: "cancelled";
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

export interface CompetitionParticipantStrategy {
  risk_level: 1 | 2 | 3 | 4 | 5;
  preferred_themes: string[];
  excluded_themes: string[];
  additional_request: string;
}

export interface CompetitionTopReturnHolding {
  stock_code: string;
  stock_name: string;
  return_percent: number;
}

export interface CompetitionDetailParticipant extends CompetitionParticipant {
  executed_trade_count: number;
  strategy: CompetitionParticipantStrategy | null;
  top_return_holding: CompetitionTopReturnHolding | null;
  total_assets: number;
  cumulative_return_percent: number;
  daily_performances: CompetitionDailyPerformance[];
}

export interface CompetitionDetailResponse {
  competition_id: number;
  competition_name: string;
  competition_type: "user_vs_ai" | "ai_vs_ai";
  state: CompetitionState;
  start_date: string;
  end_date: string;
  /** 잔여일 (목록 조회와 동일한 의미) */
  d_day: number;
  participants: CompetitionDetailParticipant[];
}

export interface DuelDetail {
  state: CompetitionState;
  name: string;
  dDay: number;
  accountId: number;
  myReturnPercent: number;
  returnHistory: { date: string; value: number }[];
}

export interface CompetitionResultParticipant extends CompetitionParticipant {
  final_asset_value: number;
  final_return_percent: number;
  rank: number;
  executed_trade_count: number;
  strategy: CompetitionParticipantStrategy | null;
  daily_performances: CompetitionDailyPerformance[];
}

export interface CompetitionResultResponse {
  competition_id: number;
  competition_name: string;
  competition_type: "user_vs_ai" | "ai_vs_ai";
  state: "completed";
  start_date: string;
  end_date: string;
  d_day: number | null;
  /** 승리한 참가자 디스플레이 이름 (공동 우승 시 "AI 1, AI 2"처럼 콤마로 연결) */
  winner: string;
  winner_participant_ids: number[];
  participants: CompetitionResultParticipant[];
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

export type CompetitionReportState = "pending" | "completed";

export interface CompetitionReportItem {
  participant_id: number;
  display_name: string;
  report_state: CompetitionReportState;
  market_analyses: CompetitionMarketAnalysis[];
  judgment_summaries: CompetitionJudgmentSummary[];
}

export interface CompetitionReportResponse {
  competition_id: number;
  competition_name?: string;
  start_date?: string;
  end_date?: string;
  reports: CompetitionReportItem[];
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

export interface CompetitionExecutionsPagination {
  limit: number;
  has_next: boolean;
  next_cursor: string | null;
}

export interface CompetitionExecutionsResponse {
  account_id: number;
  pagination: CompetitionExecutionsPagination;
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
