import Link from "next/link";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import LockIcon from "@/assets/icons/fill/lock.svg";
import type { DuelTrade } from "@/features/ai/types/duel";
import { TradeCard } from "@/shared/components/TradeCard";

type DuelAiTradeCardProps = DuelTrade;

export function DuelAiTradeCard({
  hasReasoning,
  orderId,
  ...trade
}: DuelAiTradeCardProps) {
  const isReportPending = !hasReasoning;
  return (
    <TradeCard {...trade}>
      {(hasReasoning || isReportPending) && (
        <>
          <hr className="border-border-neutral-muted" />

          {hasReasoning && orderId !== undefined && (
            <Link
              href={`/ai/trades/${orderId}`}
              className="text-text-neutral-primary caption-1-semibold flex w-full items-center justify-between"
            >
              판단 근거
              <ChevronForwardIcon
                width={14}
                height={14}
                className="text-icon-neutral-secondary"
              />
            </Link>
          )}

          {isReportPending && (
            <span className="text-text-neutral-tertiary caption-1-semibold flex w-full items-center justify-between">
              판단 근거 생성 중
              <LockIcon
                width={14}
                height={14}
                className="text-icon-neutral-secondary"
              />
            </span>
          )}
        </>
      )}
    </TradeCard>
  );
}
