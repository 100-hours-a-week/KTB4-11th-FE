"use client";

import Link from "next/link";
import { AiTradeCard } from "@/features/ai/components/AiTradeCard";
import type { AiTrade } from "@/features/ai/types/aiTrade";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import RobotFlusteredIcon from "@/assets/icons/stockspoon/robot-flustered.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useCarousel } from "@/shared/hooks/useCarousel";
import { cn } from "@/shared/utils/cn";

const MAX_TRADES = 3;

interface RecentAiTradeSectionProps {
  trades: AiTrade[];
  isError?: boolean;
  onRetry?: () => void;
}

export function RecentAiTradeSection({
  trades,
  isError,
  onRetry,
}: RecentAiTradeSectionProps) {
  const displayedTrades = trades.slice(0, MAX_TRADES);
  const { emblaRef, selectedIndex, scrollTo } = useCarousel();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="body-1-bold">최근 AI 매매</span>
        {displayedTrades.length > 1 && (
          <div className="flex items-center gap-1">
            {displayedTrades.map((trade, index) => (
              <button
                key={trade.orderId}
                type="button"
                aria-label={`${index + 1}번째 매매로 이동`}
                onClick={() => scrollTo(index)}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  index === selectedIndex
                    ? "bg-bg-accent"
                    : "bg-bg-neutral-tertiary",
                )}
              />
            ))}
          </div>
        )}
      </div>
      {isError ? (
        <div className="bg-bg-layer-default rounded-2xl">
          <ErrorState onRetry={onRetry} />
        </div>
      ) : displayedTrades.length === 0 ? (
        <div className="bg-bg-layer-default rounded-2xl">
          <EmptyState
            icon={RobotFlusteredIcon}
            message="매매 내역이 없어요"
            description="AI가 매매를 진행하면 여기에 표시돼요"
          />
        </div>
      ) : (
        <>
          <div className="-ml-3 overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {displayedTrades.map((trade) => (
                <div
                  key={trade.orderId}
                  className="min-w-0 flex-[0_0_100%] pl-3"
                >
                  <AiTradeCard {...trade} />
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/ai/trades"
            className="text-text-neutral-secondary caption-1-regular flex items-center justify-center gap-0.5 py-1"
          >
            AI 매매 내역 보기
            <ChevronForwardIcon width={12} height={12} />
          </Link>
        </>
      )}
    </div>
  );
}
