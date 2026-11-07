import type {
  CompetitionDetailResponse,
  DuelDetail,
} from "@/features/ai/types/duel";

export function toDuelDetail(detail: CompetitionDetailResponse): DuelDetail {
  const me = detail.participants.find(
    (participant) => participant.participant_type === "user",
  )!;

  return {
    state: detail.state,
    name: detail.competition_name,
    dDay: detail.d_day,
    accountId: me.account_id,
    myReturnPercent: me.cumulative_return_percent,
    returnHistory: me.daily_performances.map((performance) => ({
      date: performance.date,
      value: performance.cumulative_return_percent,
    })),
  };
}
