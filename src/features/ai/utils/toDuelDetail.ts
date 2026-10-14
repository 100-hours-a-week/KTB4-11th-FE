import type {
  CompetitionDetailResponse,
  DuelDetail,
} from "@/features/ai/types/duel";

export function toDuelDetail(detail: CompetitionDetailResponse): DuelDetail {
  return {
    name: detail.competition_name,
    dDay: detail.remaining_days,
    myReturnPercent: detail.cumulative_return_percent,
    returnHistory: detail.daily_performances.map((performance) => ({
      date: performance.date,
      value: performance.cumulative_return_percent,
    })),
  };
}
