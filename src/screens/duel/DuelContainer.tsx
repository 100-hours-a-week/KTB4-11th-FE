"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { DuelAlreadyExistsModal } from "@/features/ai/components/DuelAlreadyExistsModal";
import { DuelCard } from "@/features/ai/components/DuelCard";
import { DuelTypeSheet } from "@/features/ai/components/DuelTypeSheet";
import { OngoingDuelCarousel } from "@/features/ai/components/OngoingDuelCarousel";
import {
  DUEL_STATUS_FILTERS,
  type Duel,
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
import { trackEvent } from "@/shared/utils/analytics";

// TODO : 실제 대결 목록 조회 API 연동 시 제거
const DEMO_DUELS: Duel[] = [
  {
    id: "1",
    name: "8월 반도체 집중",
    type: "나 vs AI",
    status: "진행 중",
    startDate: "8/14",
    endDate: "9/7",
    dDay: 12,
    stockCount: 5,
    returnPercent: 6.4,
  },
  {
    id: "4",
    name: "5월 첫 대결",
    type: "나 vs AI",
    status: "종료",
    startDate: "5/1",
    endDate: "5/31",
    dDay: 0,
    stockCount: 4,
    returnPercent: 3.2,
    result: "WIN",
  },
  {
    id: "5",
    name: "4월 연습 대결",
    type: "나 vs AI",
    status: "종료",
    startDate: "4/1",
    endDate: "4/30",
    dDay: 0,
    stockCount: 2,
    returnPercent: -1.5,
    result: "LOSE",
  },
];

const ALL_FILTER: DuelStatusFilter = "전체";

export function DuelContainer() {
  const { data: kospi } = useKospiIndexQuery();
  const [statusFilter, setStatusFilter] =
    useState<DuelStatusFilter>(ALL_FILTER);
  const [isTypeSheetOpen, setIsTypeSheetOpen] = useState(false);
  const [isAlreadyExistsOpen, setIsAlreadyExistsOpen] = useState(false);

  const ongoingUserVsAiDuel = DEMO_DUELS.find(
    (duel) => duel.type === "나 vs AI" && duel.status === "진행 중",
  );
  const ongoingDuels = DEMO_DUELS.filter((duel) => duel.status === "진행 중");

  const filteredDuels = DEMO_DUELS.filter((duel) => {
    if (statusFilter === "전체") return true;
    if (statusFilter === "진행 중") return duel.status === "진행 중";
    return duel.status === "종료";
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
                toast.info("검색 기능은 v2에서 이용할 수 있어요");
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
        kospi={kospi && { value: kospi.value, changeRate: kospi.changeRate }}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-28">
        {DEMO_DUELS.length === 0 ? (
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
              <OngoingDuelCarousel duels={ongoingDuels} />

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
          ongoingDuelName={ongoingUserVsAiDuel.name}
          remainingDays={ongoingUserVsAiDuel.dDay}
          onViewOngoing={() => setStatusFilter("진행 중")}
        />
      )}
    </div>
  );
}
