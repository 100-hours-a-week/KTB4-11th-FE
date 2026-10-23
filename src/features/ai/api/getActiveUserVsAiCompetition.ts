import { getCompetitions } from "@/features/ai/api/getCompetitions";
import type { CompetitionApiItem } from "@/features/ai/types/duel";

export async function getActiveUserVsAiCompetition(): Promise<CompetitionApiItem | null> {
  let cursor: string | undefined;
  do {
    const { competitions, pagination } = await getCompetitions({
      limit: 20,
      cursor,
    });
    const active = competitions.find(
      (competition) =>
        competition.competition_type === "user_vs_ai" &&
        (competition.state === "ready" || competition.state === "in_progress"),
    );
    if (active) return active;
    if (!pagination.has_next) return null;
    if (!pagination.next_cursor || pagination.next_cursor === cursor) {
      throw new Error("기존 대결 목록을 확인할 수 없어요");
    }
    cursor = pagination.next_cursor;
  } while (cursor);
  return null;
}
