import type { AiVsAiCompareChartPoint } from "@/features/ai/components/AiVsAiCompareReturnChart";
import { fromRiskLevel } from "@/features/ai/types/aiStrategy";
import type {
  CompetitionResultParticipant,
  CompetitionResultResponse,
} from "@/features/ai/types/duel";
import type {
  AiVsAiAgentResult,
  AiVsAiDuelResultView,
} from "@/features/ai/types/aiVsAiDuelDetail";
import {
  formatFullDotDate,
  formatShortDotDate,
} from "@/features/ai/utils/duelDateFormat";

function toAiVsAiAgentResult(
  participant: CompetitionResultParticipant,
): AiVsAiAgentResult {
  const strategy = participant.strategy!;

  return {
    agentLabel: participant.display_name,
    accountId: participant.account_id,
    returnPercent: participant.final_return_percent,
    investmentTendency: fromRiskLevel(strategy.risk_level),
    interestThemes: strategy.preferred_themes,
    excludeThemes: strategy.excluded_themes,
    additionalRequest: strategy.additional_request,
    tradeCount: participant.executed_trade_count,
    summary: "",
  };
}

function toAiVsAiCompareChartData(
  aiParticipants: CompetitionResultParticipant[],
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

export function toAiVsAiDuelResult(
  result: CompetitionResultResponse,
): AiVsAiDuelResultView {
  const aiParticipants = result.participants.filter(
    (participant) => participant.participant_type === "ai",
  );

  return {
    name: result.competition_name,
    startDate: formatFullDotDate(result.start_date),
    endDate: formatShortDotDate(result.end_date),
    winnerLabel: result.winner,
    isDraw: result.winner_participant_ids.length > 1,
    agents: aiParticipants.map(toAiVsAiAgentResult),
    chartData: toAiVsAiCompareChartData(aiParticipants),
  };
}
