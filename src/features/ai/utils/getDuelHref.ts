import type { Duel } from "@/features/ai/types/duel";

export function getDuelHref(duel: Pick<Duel, "id" | "type" | "status">) {
  const isAiVsAi = duel.type === "AI끼리";
  const isEnded = duel.status === "종료";

  if (isAiVsAi) {
    return isEnded
      ? `/duel/ai-vs-ai/${duel.id}/result`
      : `/duel/ai-vs-ai/${duel.id}`;
  }

  return isEnded ? `/duel/${duel.id}/result` : `/duel/${duel.id}`;
}
