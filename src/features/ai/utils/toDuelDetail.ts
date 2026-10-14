import type {
  CompetitionDetailResponse,
  DuelDetail,
} from "@/features/ai/types/duel";

export function toDuelDetail(detail: CompetitionDetailResponse): DuelDetail {
  const myAccountId = detail.participants.find(
    (participant) => participant.participant_type === "user",
  )!.account_id;

  return {
    name: detail.competition_name,
    dDay: detail.d_day,
    accountId: myAccountId,
    myReturnPercent: detail.cumulative_return_percent,
    returnHistory: detail.daily_performances.map((performance) => ({
      date: performance.date,
      value: performance.cumulative_return_percent,
    })),
  };
}
