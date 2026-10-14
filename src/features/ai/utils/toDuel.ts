import type { CompetitionApiItem, Duel } from "@/features/ai/types/duel";

function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function toDuel(competition: CompetitionApiItem): Duel {
  return {
    id: String(competition.competition_id),
    name: competition.competition_name,
    type: "나 vs AI",
    status: competition.state === "in_progress" ? "진행 중" : "종료",
    startDate: formatShortDate(competition.start_date),
    endDate: formatShortDate(competition.end_date),
    dDay: competition.d_day,
    returnPercent: competition.cumulative_return_percent,
    result:
      competition.winner === "user"
        ? "WIN"
        : competition.winner === "ai"
          ? "LOSE"
          : undefined,
  };
}
