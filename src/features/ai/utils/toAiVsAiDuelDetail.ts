import type { AiVsAiCompareChartPoint } from "@/features/ai/components/AiVsAiCompareReturnChart";
import { fromRiskLevel } from "@/features/ai/types/aiStrategy";
import type {
  CompetitionDetailParticipant,
  CompetitionDetailResponse,
} from "@/features/ai/types/duel";
import type {
  AiVsAiAgentSummary,
  AiVsAiDuelDetailView,
} from "@/features/ai/types/aiVsAiDuelDetail";

function toAiVsAiAgentSummary(
  participant: CompetitionDetailParticipant,
): AiVsAiAgentSummary {
  const strategy = participant.strategy!;

  return {
    agentLabel: participant.display_name,
    accountId: participant.account_id,
    returnPercent: participant.cumulative_return_percent,
    investmentTendency: fromRiskLevel(strategy.risk_level),
    interestThemes: strategy.preferred_themes,
    excludeThemes: strategy.excluded_themes,
    additionalRequest: strategy.additional_request,
  };
}

function toAiVsAiCompareChartData(
  aiParticipants: CompetitionDetailParticipant[],
): AiVsAiCompareChartPoint[] {
  const dates = aiParticipants[0]?.daily_performances.map((p) => p.date) ?? [];

  return dates.map((date, index) => ({
    date,
    values: Object.fromEntries(
      aiParticipants.map((participant) => [
        participant.display_name,
        participant.daily_performances[index]?.cumulative_return_percent ?? 0,
      ]),
    ),
  }));
}

export function toAiVsAiDuelDetail(
  detail: CompetitionDetailResponse,
): AiVsAiDuelDetailView {
  const aiParticipants = detail.participants.filter(
    (participant) => participant.participant_type === "ai",
  );

  return {
    state: detail.state,
    name: detail.competition_name,
    dDay: detail.d_day,
    agents: aiParticipants.map(toAiVsAiAgentSummary),
    chartData: toAiVsAiCompareChartData(aiParticipants),
  };
}
