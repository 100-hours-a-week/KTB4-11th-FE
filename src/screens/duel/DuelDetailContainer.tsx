"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HoldingStockItem } from "@/features/account/components/HoldingStockItem";
import {
  DuelPortfolioToggle,
  type DuelPortfolioOption,
} from "@/features/ai/components/DuelPortfolioToggle";
import { DuelReturnChart } from "@/features/ai/components/DuelReturnChart";
import { useCompetitionDetailQuery } from "@/features/ai/hooks/useCompetitionDetailQuery";
import type { DuelHolding } from "@/features/ai/types/duel";
import FireIcon from "@/assets/icons/fill/fire.svg";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { cn } from "@/shared/utils/cn";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

// TODO : 보유 종목 조회 API 연동 시 제거 (대결 계좌 account_id 응답 추가 요청 대기 중)
const DEMO_HOLDINGS: DuelHolding[] = [
  {
    stockCode: "005930",
    stockName: "삼성전자",
    category: "전자",
    weightPercent: 32,
    quantity: 12,
    avgPrice: 71500,
    value: 892320,
    profitAmount: 34320,
    returnPercent: 4.0,
  },
  {
    stockCode: "005380",
    stockName: "현대차",
    category: "자동차",
    weightPercent: 28,
    quantity: 6,
    avgPrice: 245000,
    value: 1497930,
    profitAmount: 27930,
    returnPercent: 1.9,
  },
  {
    stockCode: "035720",
    stockName: "카카오",
    category: "플랫폼",
    weightPercent: 22,
    quantity: 15,
    avgPrice: 41500,
    value: 613163,
    profitAmount: -9337,
    returnPercent: -1.5,
  },
];

interface DuelDetailContainerProps {
  id: string;
}

export function DuelDetailContainer({ id }: DuelDetailContainerProps) {
  const router = useRouter();
  const [portfolio, setPortfolio] =
    useState<DuelPortfolioOption>("내 포트폴리오");
  const { data: detail } = useCompetitionDetailQuery(id);

  if (!detail) return null;

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
            {formatSignedPercent(detail.myReturnPercent)}
          </span>

          <div className="border-border-neutral-muted mt-3 rounded-xl border px-2 pt-14 pb-2">
            <DuelReturnChart
              data={detail.returnHistory}
              colorVar={chartColorVar}
              colorClass={colorClass}
            />
          </div>
          <span className="caption-1-regular text-text-neutral-tertiary text-center">
            AI 성적은 대결이 끝나면 공개돼요
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <DuelPortfolioToggle
            value={portfolio}
            onChange={setPortfolio}
            isAiLocked
            onLockedClick={() =>
              toast.info("AI 포트폴리오는 대결이 끝나면 확인할 수 있어요")
            }
          />

          <div className="flex flex-col gap-2">
            {DEMO_HOLDINGS.map((holding) => (
              <HoldingStockItem
                key={holding.stockCode}
                name={holding.stockName}
                category={holding.category}
                quantity={holding.quantity}
                avgPrice={holding.avgPrice}
                value={holding.value}
                profitAmount={holding.profitAmount}
                changeRate={holding.returnPercent}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
