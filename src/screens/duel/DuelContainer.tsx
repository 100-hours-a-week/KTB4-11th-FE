"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DuelAlreadyExistsModal } from "@/features/ai/components/DuelAlreadyExistsModal";
import { DuelCard } from "@/features/ai/components/DuelCard";
import { DuelCardSkeleton } from "@/features/ai/components/DuelCardSkeleton";
import { DuelTypeSheet } from "@/features/ai/components/DuelTypeSheet";
import { OngoingDuelCarousel } from "@/features/ai/components/OngoingDuelCarousel";
import { useCompetitionsInfiniteQuery } from "@/features/ai/hooks/useCompetitionsInfiniteQuery";
import { useCompetitionsQuery } from "@/features/ai/hooks/useCompetitionsQuery";
import { useActiveUserVsAiDuelQuery } from "@/features/ai/hooks/useActiveUserVsAiDuelQuery";
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
import { EmptyStateCard } from "@/shared/components/EmptyStateCard";
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
  const router = useRouter();
  const { data: kospi } = useKospiIndexQuery();
  const [statusFilter, setStatusFilter] =
    useState<DuelStatusFilter>(ALL_FILTER);
  const [isTypeSheetOpen, setIsTypeSheetOpen] = useState(false);
  const [isAlreadyExistsOpen, setIsAlreadyExistsOpen] = useState(false);

  const { data: ongoingDuels } = useCompetitionsQuery({
    state: "in_progress",
  });
  const {
    data: ongoingUserVsAiDuel,
    refetch: refetchActiveDuel,
    isFetching: isCheckingExistingDuel,
  } = useActiveUserVsAiDuelQuery();

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

  useEffect(() => {
    if (!isDuelsPending && filteredDuels.length === 0) {
      trackEvent("empty_state_view", {
        screen: "duel_list",
        empty_type: "no_duels",
      });
    }
  }, [isDuelsPending, filteredDuels.length]);

  async function handleUserVsAiSelect() {
    const result = await refetchActiveDuel();
    if (result.isError) {
      toast.error("기존 대결을 확인하지 못했어요. 다시 시도해 주세요.");
      return;
    }
    setIsTypeSheetOpen(false);
    if (result.data) setIsAlreadyExistsOpen(true);
    else router.push("/duel/create");
  }

  return (
    <div className="bg-page-gradient pt-screen-top flex h-full flex-col">
      <Header
        className="px-5"
        right={
          <>
            <button type="button" onClick={() => router.push("/search")}>
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
          <EmptyStateCard>
            <EmptyState
              icon={TrophyHappyIcon}
              message="아직 대결 기록이 없어요"
              description="AI와 겨루거나 AI끼리 전략을 비교해보세요"
              actionLabel="대결 생성하기"
              onAction={handleCreateClick}
            />
          </EmptyStateCard>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-2 pt-4">
            <div className="flex flex-col gap-4">
              <OngoingDuelCarousel duels={ongoingDuels ?? []} />

              <div className="flex items-center justify-between">
                <FilterChips
                  options={DUEL_STATUS_FILTERS}
                  value={statusFilter}
                  onChange={(value) => {
                    trackEvent("filter_chip_click", {
                      screen: "duel_list",
                      filter_value: value,
                    });
                    setStatusFilter(value);
                  }}
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
              <EmptyStateCard className="pt-20">
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
              </EmptyStateCard>
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
        isCheckingExistingDuel={isCheckingExistingDuel}
        onSelectUserVsAi={handleUserVsAiSelect}
      />
      {ongoingUserVsAiDuel && (
        <DuelAlreadyExistsModal
          open={isAlreadyExistsOpen}
          onOpenChange={setIsAlreadyExistsOpen}
          ongoingDuelId={ongoingUserVsAiDuel.id}
          ongoingDuelName={ongoingUserVsAiDuel.name}
          remainingDays={ongoingUserVsAiDuel.dDay}
          isReady={ongoingUserVsAiDuel.status === "시작 대기"}
        />
      )}
    </div>
  );
}
