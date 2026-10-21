"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { DuelAlreadyExistsModal } from "@/features/ai/components/DuelAlreadyExistsModal";
import { DuelCard } from "@/features/ai/components/DuelCard";
import { DuelCardSkeleton } from "@/features/ai/components/DuelCardSkeleton";
import { DuelTypeSheet } from "@/features/ai/components/DuelTypeSheet";
import { OngoingDuelCarousel } from "@/features/ai/components/OngoingDuelCarousel";
import { useCompetitionsInfiniteQuery } from "@/features/ai/hooks/useCompetitionsInfiniteQuery";
import { useCompetitionsQuery } from "@/features/ai/hooks/useCompetitionsQuery";
import {
  DUEL_STATUS_FILTERS,
  type DuelStatusFilter,
} from "@/features/ai/types/duel";
import { useKospiIndexQuery } from "@/features/stock/hooks/useKospiIndexQuery";
import PlusIcon from "@/assets/icons/fill/plus.svg";
import SearchIcon from "@/assets/icons/fill/search.svg";
import ProfileIcon from "@/assets/icons/fill/profile.svg";
import TrophyHappyIcon from "@/assets/icons/stockspoon/trophy-happy.svg";
import { BottomTabBar } from "@/shared/components/BottomTabBar";
import { EmptyState } from "@/shared/components/EmptyState";
import { FilterChips } from "@/shared/components/FilterChips";
import { Header } from "@/shared/components/Header";
import { StockTickerBar } from "@/shared/components/StockTickerBar";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { trackEvent } from "@/shared/utils/analytics";

const ALL_FILTER: DuelStatusFilter = "전체";

const STATUS_FILTER_TO_STATE: Record<
  DuelStatusFilter,
  "in_progress" | "completed" | undefined
> = {
  전체: undefined,
  "진행 중": "in_progress",
  "지난 대결": "completed",
};

export function DuelContainer() {
  const { data: kospi } = useKospiIndexQuery();
  const [statusFilter, setStatusFilter] =
    useState<DuelStatusFilter>(ALL_FILTER);
  const [isTypeSheetOpen, setIsTypeSheetOpen] = useState(false);
  const [isAlreadyExistsOpen, setIsAlreadyExistsOpen] = useState(false);

  const { data: ongoingDuels } = useCompetitionsQuery({
    state: "in_progress",
  });
  const ongoingUserVsAiDuel = (ongoingDuels ?? []).find(
    (duel) => duel.type === "나 vs AI",
  );

  const {
    data: duelsPages,
    isPending: isDuelsPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCompetitionsInfiniteQuery(STATUS_FILTER_TO_STATE[statusFilter]);
  const filteredDuels = (duelsPages?.pages ?? []).flatMap((page) => page.duels);
  const sentinelRef = useInfiniteScroll({
    hasMore: hasNextPage && !isFetchingNextPage,
    onLoadMore: () => fetchNextPage(),
  });

  function handleCreateClick() {
    setIsTypeSheetOpen(true);
  }

  return (
    <div className="bg-page-gradient pt-screen-top flex h-full flex-col">
      <Header
        className="px-5"
        right={
          <>
            <button
              type="button"
              onClick={() => {
                trackEvent("unsupported_feature_click", {
                  feature_name: "search",
                });
                toast.info("검색 기능은 v3에서 이용할 수 있어요");
              }}
            >
              <SearchIcon
                width={24}
                height={24}
                className="text-icon-neutral-primary"
              />
            </button>
            <Link href="/mypage">
              <ProfileIcon
                width={24}
                height={24}
                className="text-icon-neutral-primary"
              />
            </Link>
          </>
        }
      />
      <StockTickerBar
        title="대결"
        logo={false}
        kospi={kospi && { value: kospi.value, changeRate: kospi.rate }}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-28">
        {isDuelsPending ? (
          <div className="flex flex-col gap-2 pt-4">
            <DuelCardSkeleton />
            <DuelCardSkeleton />
            <DuelCardSkeleton />
          </div>
        ) : filteredDuels.length === 0 && statusFilter === "전체" ? (
          <div className="bg-bg-layer-default flex flex-1 flex-col items-center rounded-2xl pt-32">
            <EmptyState
              icon={TrophyHappyIcon}
              message="아직 대결 기록이 없어요"
              description="AI와 겨루거나 AI끼리 전략을 비교해보세요"
              actionLabel="대결 생성하기"
              onAction={handleCreateClick}
            />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-2 pt-4">
            <div className="flex flex-col gap-4">
              <OngoingDuelCarousel duels={ongoingDuels ?? []} />

              <div className="flex items-center justify-between">
                <FilterChips
                  options={DUEL_STATUS_FILTERS}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />
                <button
                  type="button"
                  onClick={handleCreateClick}
                  aria-label="새 대결 생성"
                  className="bg-bg-neutral-primary text-text-neutral-inverse flex size-8 shrink-0 items-center justify-center rounded-full"
                >
                  <PlusIcon width={18} height={18} />
                </button>
              </div>
            </div>

            {filteredDuels.length === 0 ? (
              <div className="bg-bg-layer-default flex flex-1 flex-col items-center rounded-2xl pt-20">
                <EmptyState
                  icon={TrophyHappyIcon}
                  message={
                    statusFilter === "진행 중"
                      ? "진행 중인 대결이 없어요"
                      : "지난 대결이 없어요"
                  }
                  description={
                    statusFilter === "진행 중"
                      ? "새로운 대결을 생성해 보세요"
                      : "대결이 종료되면 리포트가 표시돼요"
                  }
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredDuels.map((duel) => (
                  <DuelCard key={duel.id} {...duel} />
                ))}
                {hasNextPage && <div ref={sentinelRef} className="h-1" />}
              </div>
            )}
          </div>
        )}
      </div>
      <BottomTabBar />

      <DuelTypeSheet
        open={isTypeSheetOpen}
        onOpenChange={setIsTypeSheetOpen}
        hasOngoingUserVsAiDuel={!!ongoingUserVsAiDuel}
        onBlockedByOngoingDuel={() => setIsAlreadyExistsOpen(true)}
      />
      {ongoingUserVsAiDuel && (
        <DuelAlreadyExistsModal
          open={isAlreadyExistsOpen}
          onOpenChange={setIsAlreadyExistsOpen}
          ongoingDuelId={ongoingUserVsAiDuel.id}
          ongoingDuelName={ongoingUserVsAiDuel.name}
          remainingDays={ongoingUserVsAiDuel.dDay}
        />
      )}
    </div>
  );
}
