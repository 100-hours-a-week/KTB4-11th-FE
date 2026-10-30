"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BadgeIcon from "@/assets/icons/fill/badge.svg";
import CalendarIcon from "@/assets/icons/fill/calendar.svg";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import CrownIcon from "@/assets/icons/fill/crown.svg";
import RobotIcon from "@/assets/icons/fill/robot.svg";
import BasketFlusteredIcon from "@/assets/icons/stockspoon/basket-flustered.svg";
import RobotFlusteredIcon from "@/assets/icons/stockspoon/robot-flustered.svg";
import TrophyHappyIcon from "@/assets/icons/stockspoon/trophy-happy.svg";
import { DuelCompareReturnChart } from "@/features/ai/components/DuelCompareReturnChart";
import { TradeCard } from "@/shared/components/TradeCard";
import { DuelAiTradeCard } from "@/features/ai/components/DuelAiTradeCard";
import { useCompetitionExecutionsInfiniteQuery } from "@/features/ai/hooks/useCompetitionExecutionsInfiniteQuery";
import { useCompetitionResultQuery } from "@/features/ai/hooks/useCompetitionResultQuery";
import { EmptyState } from "@/shared/components/EmptyState";
import { EmptyStateCard } from "@/shared/components/EmptyStateCard";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { FilterChips } from "@/shared/components/FilterChips";
import { TradeCardSkeleton } from "@/shared/components/TradeCardSkeleton";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { trackEvent } from "@/shared/utils/analytics";
import { cn } from "@/shared/utils/cn";
import { formatSignedPercent } from "@/shared/utils/getReturnRateInfo";

const MY_TRADES_FILTER = "내 매매 내역";
const AI_TRADES_FILTER = "AI 매매 내역";
const TRADE_FILTERS = [MY_TRADES_FILTER, AI_TRADES_FILTER] as const;
type TradeFilter = (typeof TRADE_FILTERS)[number];

interface DuelResultContainerProps {
  id: string;
}

export function DuelResultContainer({ id }: DuelResultContainerProps) {
  const router = useRouter();
  const [tradeFilter, setTradeFilter] = useState<TradeFilter>(MY_TRADES_FILTER);
  const { data: result, error } = useCompetitionResultQuery(id);
  const myExecutions = useCompetitionExecutionsInfiniteQuery(result?.accountId);
  const aiExecutions = useCompetitionExecutionsInfiniteQuery(
    result?.aiAccountId,
  );

  const isWin = result?.result === "WIN";
  const ResultIcon = isWin ? CrownIcon : RobotIcon;
  const myTrades = (myExecutions.data?.pages ?? []).flatMap(
    (page) => page.trades,
  );
  const aiTrades = (aiExecutions.data?.pages ?? []).flatMap(
    (page) => page.trades,
  );
  const isMyTab = tradeFilter === MY_TRADES_FILTER;
  const trades = isMyTab ? myTrades : aiTrades;
  const activeExecutions = isMyTab ? myExecutions : aiExecutions;
  const isTradesPending = activeExecutions.isPending;
  const sentinelRef = useInfiniteScroll({
    hasMore:
      activeExecutions.hasNextPage && !activeExecutions.isFetchingNextPage,
    onLoadMore: () => activeExecutions.fetchNextPage(),
  });

  useEffect(() => {
    if (!isWin) return;
    confetti({
      particleCount: 120,
      spread: 90,
      startVelocity: 40,
      origin: { y: 0.3 },
    });
  }, [isWin]);

  const isNotCompleted =
    isAxiosError(error) &&
    error.response?.data?.code === "COMPETITION_NOT_COMPLETED";

  useEffect(() => {
    if (isNotCompleted) {
      trackEvent("error_view", {
        screen: "duel_result",
        api_name: "competitions",
        error_code: "COMPETITION_NOT_COMPLETED",
      });
    }
  }, [isNotCompleted]);

  if (isNotCompleted) {
    return (
      <div className="pt-screen-top flex h-full flex-col">
        <Header
          className="px-5 py-3"
          title="대결 결과"
          left={<HeaderBackButton fallbackHref="/duel" />}
        />
        <EmptyStateCard className="mx-5 mt-4 mb-5 px-5 break-keep">
          <EmptyState
            icon={TrophyHappyIcon}
            textClassName="gap-2"
            message="아직 완료되지 않은 대결이에요"
            description="대결 상세에서 현재 상태를 확인해 주세요"
            actionLabel="대결 상세 보기"
            onAction={() => router.replace(`/duel/${id}`)}
          />
        </EmptyStateCard>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        className="px-5 py-3"
        left={<HeaderBackButton onClick={() => router.push("/duel")} />}
        title="대결 결과"
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pt-4 pb-10">
        <div className="bg-bg-layer-default flex flex-col items-center gap-1 rounded-2xl p-4">
          <ResultIcon
            width={40}
            height={40}
            className={isWin ? "text-[#FFD500]" : "text-icon-success"}
          />
          <span className="heading-1-bold">
            {isWin ? "내가 이겼어요" : "AI가 이겼어요"}
          </span>
          <span className="body-2-regular text-text-neutral-secondary flex items-center">
            <BadgeIcon
              width={14}
              height={14}
              className="text-icon-accent mr-0.5"
            />
            {result.name}
            <span className="bg-border-neutral-muted mx-1.5 h-3 w-px" />
            <CalendarIcon
              width={13}
              height={13}
              className="text-icon-accent mr-0.5"
            />
            {result.startDate} ~ {result.endDate}
          </span>

          <div className="mt-3 flex w-full items-center justify-center gap-4">
            <div
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-6 py-3",
                isWin ? "bg-sky-blue-50" : "bg-bg-layer-basement",
              )}
            >
              <span className="caption-1-semibold text-text-neutral-secondary font-bold">
                나
              </span>
              <span
                className={cn(
                  "heading-1-bold",
                  isWin ? "text-text-accent" : "text-text-neutral-secondary",
                )}
              >
                {formatSignedPercent(result.myReturnPercent)}
              </span>
            </div>
            <span className="text-text-neutral-secondary body-1-bold">vs</span>
            <div
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-6 py-3",
                isWin ? "bg-bg-layer-basement" : "bg-sky-blue-50",
              )}
            >
              <span className="caption-1-semibold text-text-neutral-secondary font-bold">
                AI
              </span>
              <span
                className={cn(
                  "heading-1-bold",
                  isWin ? "text-text-neutral-secondary" : "text-text-accent",
                )}
              >
                {formatSignedPercent(result.aiReturnPercent)}
              </span>
            </div>
          </div>

          <div className="border-border-neutral-muted mt-3 w-full rounded-xl border px-2 pt-14 pb-2">
            <DuelCompareReturnChart
              data={result.compareHistory}
              isWin={isWin}
            />
          </div>
        </div>

        <Link
          href={`/duel/${id}/report`}
          onClick={() =>
            trackEvent("duel_report_click", { competition_id: id })
          }
          className="bg-bg-layer-default -mt-1 flex items-center justify-between rounded-2xl p-4"
        >
          <span className="body-1-semibold">AI 리포트 보기</span>
          <ChevronForwardIcon
            width={20}
            height={20}
            className="text-icon-neutral-secondary"
          />
        </Link>

        <div className="flex flex-col gap-3">
          <FilterChips
            options={TRADE_FILTERS}
            value={tradeFilter}
            onChange={setTradeFilter}
          />
          <div className="flex flex-col gap-2">
            {isTradesPending ? (
              <>
                <TradeCardSkeleton />
                <TradeCardSkeleton />
              </>
            ) : trades.length === 0 ? (
              <div className="bg-bg-layer-default rounded-2xl">
                {tradeFilter === AI_TRADES_FILTER ? (
                  <EmptyState
                    icon={RobotFlusteredIcon}
                    message="AI 매매 내역이 없어요"
                    description="대결 기간 중 진행한 매매가 없어요"
                  />
                ) : (
                  <EmptyState
                    icon={BasketFlusteredIcon}
                    message="매매 내역이 없어요"
                    description="대결 기간 중 진행한 매매가 없어요"
                  />
                )}
              </div>
            ) : (
              <>
                {trades.map((trade) =>
                  tradeFilter === AI_TRADES_FILTER ? (
                    <DuelAiTradeCard key={trade.tradeId} {...trade} />
                  ) : (
                    <TradeCard key={trade.tradeId} {...trade} />
                  ),
                )}
                {activeExecutions.hasNextPage && (
                  <div ref={sentinelRef} className="h-1" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
