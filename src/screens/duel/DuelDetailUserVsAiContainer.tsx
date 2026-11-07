"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HoldingStockItem } from "@/features/account/components/HoldingStockItem";
import { HoldingStockItemSkeleton } from "@/features/account/components/HoldingStockItemSkeleton";
import { useHoldingsQuery } from "@/features/account/hooks/useHoldingsQuery";
import { toHoldingStock } from "@/features/account/utils/toHoldingStock";
import {
  DuelPortfolioToggle,
  type DuelPortfolioOption,
} from "@/features/ai/components/DuelPortfolioToggle";
import { DuelReturnChart } from "@/features/ai/components/DuelReturnChart";
import { useCompetitionDetailQuery } from "@/features/ai/hooks/useCompetitionDetailQuery";
import FireIcon from "@/assets/icons/fill/fire.svg";
import InfoIcon from "@/assets/icons/fill/info.svg";
import BasketFlusteredIcon from "@/assets/icons/stockspoon/basket-flustered.svg";
import TrophyHappyIcon from "@/assets/icons/stockspoon/trophy-happy.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { EmptyStateCard } from "@/shared/components/EmptyStateCard";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { trackEvent } from "@/shared/utils/analytics";
import { cn } from "@/shared/utils/cn";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

interface DuelDetailContainerProps {
  id: string;
}

export function DuelDetailContainer({ id }: DuelDetailContainerProps) {
  const router = useRouter();
  const [portfolio, setPortfolio] =
    useState<DuelPortfolioOption>("내 포트폴리오");
  const { data: detail } = useCompetitionDetailQuery(id);
  const { data: holdingsData, isPending: isHoldingsPending } = useHoldingsQuery(
    detail?.state === "ready" ? undefined : detail?.accountId,
  );

  if (!detail) return null;

  if (detail.state === "ready") {
    return (
      <div className="pt-screen-top flex h-full flex-col">
        <Header
          className="px-5 py-3"
          title="대결 시작 대기"
          left={<HeaderBackButton fallbackHref="/duel" />}
        />
        <EmptyStateCard className="mx-5 mt-4 mb-5 px-5 break-keep whitespace-pre-line">
          <EmptyState
            icon={TrophyHappyIcon}
            textClassName="gap-2"
            message="장이 마감된 후 생성한 대결이에요"
            description={
              "다음 장이 열리면 대결이 시작돼요\n진행 상황은 이 화면에서 확인할 수 있어요"
            }
          />
        </EmptyStateCard>
      </div>
    );
  }

  const holdings = (holdingsData?.holdings ?? []).map(toHoldingStock);

  const { colorClass } = getReturnRateInfo(detail.myReturnPercent);
  const chartColorVar =
    detail.myReturnPercent > 0
      ? "var(--color-text-price-rise)"
      : detail.myReturnPercent < 0
        ? "var(--color-text-price-fall)"
        : "var(--color-text-price-flat)";

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        className="px-5 py-3"
        left={<HeaderBackButton onClick={() => router.push("/duel")} />}
        title={detail.name}
        right={
          <span className="text-text-neutral-secondary body-2-semibold flex items-center gap-0.5">
            <FireIcon width={14} height={14} />
            D-{detail.dDay}
          </span>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pt-4 pb-10">
        <div className="bg-bg-layer-default flex flex-col gap-2 rounded-2xl p-4">
          <span className="body-2-semibold text-text-neutral-secondary">
            내 수익률
          </span>
          <span className={cn("title-1", colorClass)}>
            {formatSignedPercent(detail.myReturnPercent, 2)}
          </span>

          {detail.returnHistory.length === 0 ? (
            <div className="border-border-neutral-muted mt-3 flex h-64 items-center justify-center rounded-xl border px-2">
              <span className="caption-1-regular text-text-neutral-tertiary text-center">
                장마감 후 오늘의 수익률이 반영돼요
              </span>
            </div>
          ) : (
            <div className="border-border-neutral-muted mt-3 rounded-xl border px-2 pt-14 pb-2">
              <DuelReturnChart
                data={detail.returnHistory}
                colorVar={chartColorVar}
                colorClass={colorClass}
              />
            </div>
          )}
          <span className="flex items-center justify-center gap-1">
            <InfoIcon
              width={12}
              height={12}
              className="text-text-neutral-tertiary"
            />
            <span className="caption-1-regular text-text-neutral-tertiary">
              AI 성적은 대결 종료 후 공개돼요
            </span>
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <DuelPortfolioToggle
            value={portfolio}
            onChange={(value) => {
              trackEvent("filter_chip_click", {
                screen: "duel_detail",
                filter_value: value,
              });
              setPortfolio(value);
            }}
            isAiLocked
            onLockedClick={() =>
              toast.info("AI 포트폴리오는 대결이 끝나면 확인할 수 있어요")
            }
          />

          <div className="flex flex-1 flex-col gap-2">
            {isHoldingsPending ? (
              <>
                <HoldingStockItemSkeleton />
                <HoldingStockItemSkeleton />
                <HoldingStockItemSkeleton />
              </>
            ) : holdings.length === 0 ? (
              <div className="bg-bg-layer-default flex flex-1 flex-col items-center justify-center rounded-2xl">
                <EmptyState
                  icon={BasketFlusteredIcon}
                  message="보유 중인 종목이 없어요"
                  description="체결된 매매가 있으면 여기 표시돼요"
                />
              </div>
            ) : (
              holdings.map((holding) => (
                <HoldingStockItem key={holding.id} {...holding} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
