"use client";

import Link from "next/link";
import { HomeTradeCard } from "@/features/stock/components/trade/HomeTradeCard";
import { HomeTradeCardSkeleton } from "@/features/stock/components/trade/HomeTradeCardSkeleton";
import type { Trade } from "@/shared/types/trade";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import CartFlusteredIcon from "@/assets/icons/stockspoon/cart-flustered.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useCarousel } from "@/shared/hooks/useCarousel";
import { cn } from "@/shared/utils/cn";

const MAX_TRADES = 3;

interface RecentTradeSectionProps {
  trades: Trade[];
  isPending?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function RecentTradeSection({
  trades,
  isPending,
  isError,
  onRetry,
}: RecentTradeSectionProps) {
  const displayedTrades = trades.slice(0, MAX_TRADES);
  const { emblaRef, selectedIndex, scrollTo } = useCarousel();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="body-1-bold">최근 매매</span>
        {displayedTrades.length > 1 && (
          <div className="flex items-center gap-1">
            {displayedTrades.map((trade, index) => (
              <button
                key={trade.tradeId}
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
      ) : isPending ? (
        <HomeTradeCardSkeleton />
      ) : displayedTrades.length === 0 ? (
        <div className="bg-bg-layer-default rounded-2xl">
          <EmptyState
            icon={CartFlusteredIcon}
            message="매매 내역이 없어요"
            description="매매를 진행하면 여기에 표시돼요"
          />
        </div>
      ) : (
        <>
          <div className="-ml-3 overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {displayedTrades.map((trade) => (
                <div
                  key={trade.tradeId}
                  className="min-w-0 flex-[0_0_100%] pl-3"
                >
                  <HomeTradeCard {...trade} />
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/trades"
            className="text-text-neutral-secondary caption-1-regular flex items-center justify-center gap-0.5 py-1"
          >
            매매 내역 전체 보기
            <ChevronForwardIcon width={12} height={12} />
          </Link>
        </>
      )}
    </div>
  );
}
