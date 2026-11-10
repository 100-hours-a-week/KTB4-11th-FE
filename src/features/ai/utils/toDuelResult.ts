import type {
  CompetitionResultResponse,
  DuelResultSummary,
} from "@/features/ai/types/duel";
import {
  formatFullDotDate,
  formatShortDotDate,
} from "@/features/ai/utils/duelDateFormat";

export function toDuelResultSummary(
  result: CompetitionResultResponse,
): DuelResultSummary {
  const me = result.participants.find(
    (participant) => participant.participant_type === "user",
  )!;
  const ai = result.participants.find(
    (participant) => participant.participant_type === "ai",
  )!;

  return {
    name: result.competition_name,
    startDate: formatFullDotDate(result.start_date),
    endDate: formatShortDotDate(result.end_date),
    accountId: me.account_id,
    aiAccountId: ai.account_id,
    myReturnPercent: me.final_return_percent,
    aiReturnPercent: ai.final_return_percent,
    result:
      result.winner_participant_ids.length > 1
        ? "DRAW"
        : result.winner_participant_ids.includes(me.participant_id)
          ? "WIN"
          : "LOSE",
    compareHistory: me.daily_performances.map((performance, index) => ({
      date: performance.date,
      myValue: performance.cumulative_return_percent ?? 0,
      aiValue: ai.daily_performances[index]?.cumulative_return_percent ?? 0,
    })),
  };
}
