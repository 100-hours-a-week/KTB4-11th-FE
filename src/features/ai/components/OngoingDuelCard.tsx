"use client";

import Link from "next/link";
import { DuelProgressBar } from "@/features/ai/components/DuelProgressBar";
import { useAiVsAiDuelDetailQuery } from "@/features/ai/hooks/useAiVsAiDuelDetailQuery";
import type { Duel } from "@/features/ai/types/duel";
import { getDuelHref } from "@/features/ai/utils/getDuelHref";
import { getLeadingAgents } from "@/features/ai/utils/getLeadingAgents";
import CalendarIcon from "@/assets/icons/fill/calendar.svg";
import FireIcon from "@/assets/icons/fill/fire.svg";
import { trackEvent } from "@/shared/utils/analytics";
import { cn } from "@/shared/utils/cn";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

interface OngoingDuelCardProps {
  duel: Duel;
  progressPercent: number;
}

export function OngoingDuelCard({
  duel,
  progressPercent,
}: OngoingDuelCardProps) {
  const isAiVsAi = duel.type === "AI끼리";
  const aiVsAiDetail = useAiVsAiDuelDetailQuery(duel.id, {
    enabled: isAiVsAi,
  });

  let returnLabel = "내 수익률";
  let returnPercent = duel.returnPercent;

  if (isAiVsAi) {
    const agents = aiVsAiDetail.data?.agents ?? [];
    const leader = getLeadingAgents(agents)[0];
    returnLabel = leader ? `${leader.agentLabel} 수익률` : "수익률";
    returnPercent = leader?.returnPercent ?? null;
  }

  return (
    <Link
      href={getDuelHref(duel)}
      onClick={() => trackEvent("duel_card_click", { status: "in_progress" })}
      className="bg-bg-layer-default relative flex flex-col gap-1 rounded-2xl p-4"
    >
      <span className="text-text-neutral-secondary body-2-semibold absolute top-4 right-4 flex items-center gap-0.5">
        <FireIcon width={16} height={16} />
        D-{duel.dDay}
      </span>
      <div className="flex items-center gap-2 pr-10">
        <span className="body-1-semibold">{duel.name}</span>
        <span className="bg-sky-blue-50 text-text-accent caption-1-semibold rounded px-1.5 py-0.5">
          {duel.type}
        </span>
      </div>
      <span className="text-text-neutral-secondary flex items-center gap-0.5">
        <CalendarIcon width={14} height={14} />
        <span className="caption-1-regular">
          {duel.startDate} ~ {duel.endDate}
        </span>
      </span>
      <span className="caption-1-regular text-text-neutral-tertiary mt-1">
        {returnLabel}
      </span>
      {returnPercent !== null ? (
        <span
          className={cn(
            "heading-1-bold",
            getReturnRateInfo(returnPercent).colorClass,
          )}
        >
          {formatSignedPercent(returnPercent)}
        </span>
      ) : (
        <span className="heading-1-bold text-text-neutral-tertiary">
          집계 중
        </span>
      )}
      <DuelProgressBar progressPercent={progressPercent} dDay={duel.dDay} />
    </Link>
  );
}
