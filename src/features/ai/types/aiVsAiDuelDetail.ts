import type { AiVsAiCompareChartPoint } from "@/features/ai/components/AiVsAiCompareReturnChart";
import type { InvestmentTendency } from "@/features/ai/types/aiStrategy";
import type { CompetitionState } from "@/features/ai/types/duel";
import type { Trade } from "@/shared/types/trade";

export interface AiVsAiAgentSummary {
  agentLabel: string;
  accountId?: number;
  returnPercent: number;
  investmentTendency: InvestmentTendency;
  interestThemes: string[];
  excludeThemes: string[];
  additionalRequest: string;
}

export interface AiVsAiTrade extends Trade {
  agentLabel: string;
  orderId?: number;
  hasReasoning?: boolean;
}

export interface AiVsAiAgentResult extends AiVsAiAgentSummary {
  tradeCount: number;
  summary: string;
}

export interface AiVsAiDuelDetail {
  name: string;
  dDay: number;
  agents: AiVsAiAgentSummary[];
  trades: AiVsAiTrade[];
}

export interface AiVsAiDuelDetailView {
  state: CompetitionState;
  name: string;
  dDay: number;
  agents: AiVsAiAgentSummary[];
  chartData: AiVsAiCompareChartPoint[];
}

export interface AiVsAiDuelResult {
  name: string;
  startDate: string;
  endDate: string;
  winnerLabel: string;
  agents: AiVsAiAgentResult[];
}
