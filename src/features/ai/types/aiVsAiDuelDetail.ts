import type { AiVsAiCompareChartPoint } from "@/features/ai/components/AiVsAiCompareReturnChart";
import type { InvestmentTendency } from "@/features/ai/types/aiStrategy";
import type { CompetitionState } from "@/features/ai/types/duel";

export interface AiVsAiAgentSummary {
  agentLabel: string;
  accountId?: number;
  returnPercent: number | null;
  investmentTendency: InvestmentTendency;
  interestThemes: string[];
  excludeThemes: string[];
  additionalRequest: string;
}

export interface AiVsAiAgentResult extends AiVsAiAgentSummary {
  tradeCount: number;
  summary: string;
}

export interface AiVsAiDuelDetailView {
  state: CompetitionState;
  name: string;
  dDay: number;
  agents: AiVsAiAgentSummary[];
  chartData: AiVsAiCompareChartPoint[];
}

export interface AiVsAiDuelResultView {
  name: string;
  startDate: string;
  endDate: string;
  winnerLabel: string;
  isDraw: boolean;
  agents: AiVsAiAgentResult[];
  chartData: AiVsAiCompareChartPoint[];
}
