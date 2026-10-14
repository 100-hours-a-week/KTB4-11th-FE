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
  return {
    name: result.competition_name,
    startDate: formatFullDotDate(result.start_date),
    endDate: formatShortDotDate(result.end_date),
    accountId: result.account_id,
    myReturnPercent: result.user_final_return_percent,
    aiReturnPercent: result.ai_final_return_percent,
    result: result.winner === "user" ? "WIN" : "LOSE",
    compareHistory: result.daily_performances.map((performance) => ({
      date: performance.date,
      myValue: performance.user_cumulative_return_percent,
      aiValue: performance.ai_cumulative_return_percent,
    })),
  };
}
