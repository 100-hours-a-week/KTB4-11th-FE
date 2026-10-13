"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BadgeIcon from "@/assets/icons/fill/badge.svg";
import CalendarIcon from "@/assets/icons/fill/calendar.svg";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import CrownIcon from "@/assets/icons/fill/crown.svg";
import RobotIcon from "@/assets/icons/fill/robot.svg";
import {
  DuelCompareReturnChart,
  type DuelCompareChartPoint,
} from "@/features/ai/components/DuelCompareReturnChart";
import { DuelTradeCard } from "@/features/ai/components/DuelTradeCard";
import type { DuelResult, DuelTrade } from "@/features/ai/types/duel";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { FilterChips } from "@/shared/components/FilterChips";
import { cn } from "@/shared/utils/cn";
import { formatSignedPercent } from "@/shared/utils/getReturnRateInfo";

// TODO : 실제 대결 결과 조회 API 연동 시 제거
const DEMO_DUEL_RESULT = {
  name: "8월 반도체 집중",
  startDate: "2026.08.14",
  endDate: "09.07",
  myReturnPercent: 5.6,
  aiReturnPercent: 8.2,
  result: "LOSE" as DuelResult,
};

// TODO : 실제 대결 결과 조회 API 연동 시 제거
const DEMO_COMPARE_HISTORY: DuelCompareChartPoint[] = [
  { date: "2026-08-14", myValue: 0, aiValue: 0 },
  { date: "2026-08-19", myValue: 1.8, aiValue: 1.1 },
  { date: "2026-08-24", myValue: 3.4, aiValue: 2.9 },
  { date: "2026-08-29", myValue: 5.1, aiValue: 3.3 },
  { date: "2026-09-03", myValue: 6.9, aiValue: 4.8 },
  { date: "2026-09-07", myValue: 8.2, aiValue: 5.6 },
];

const MY_TRADES_FILTER = "내 매매 내역";
const AI_TRADES_FILTER = "AI 매매 내역";
const TRADE_FILTERS = [MY_TRADES_FILTER, AI_TRADES_FILTER] as const;
type TradeFilter = (typeof TRADE_FILTERS)[number];

// TODO : 실제 매매 내역 조회 API 연동 시 제거
const DEMO_MY_TRADES: DuelTrade[] = [
  {
    tradeId: 1,
    stockName: "SK하이닉스",
    tradeSide: "매도",
    tradeDate: "2026.09.03 14:20",
    quantity: 2,
    price: 196000,
    realizedProfit: 18400,
    profitRate: 4.9,
  },
  {
    tradeId: 2,
    stockName: "삼성전자",
    tradeSide: "매수",
    tradeDate: "2026.08.20 10:05",
    quantity: 12,
    price: 71500,
  },
];

// TODO : 실제 매매 내역 조회 API 연동 시 제거
const DEMO_AI_TRADES: DuelTrade[] = [
  {
    tradeId: 3,
    stockName: "카카오",
    tradeSide: "매도",
    tradeDate: "2026.08.25 09:40",
    quantity: 120,
    price: 40500,
    realizedProfit: 102000,
    profitRate: 2.1,
  },
  {
    tradeId: 4,
    stockName: "카카오",
    tradeSide: "매수",
    tradeDate: "2026.08.24 10:12",
    quantity: 30,
    price: 41500,
    reasoning: "RSI 과매수 구간 진입, 단기 조정 가능성 낮다고 판단",
    orderId: 1001,
  },
  {
    tradeId: 5,
    stockName: "카카오",
    tradeSide: "매수",
    tradeDate: "2026.08.23 10:03",
    quantity: 30,
    price: 41000,
    reasoning: "데이터센터 화재 이슈 선반영 후 반등 신호 포착",
    orderId: 1002,
  },
];

interface DuelResultContainerProps {
  id: string;
}

export function DuelResultContainer({ id }: DuelResultContainerProps) {
  const router = useRouter();
  const [tradeFilter, setTradeFilter] = useState<TradeFilter>(MY_TRADES_FILTER);

  const isWin = DEMO_DUEL_RESULT.result === "WIN";
  const ResultIcon = isWin ? CrownIcon : RobotIcon;
  const trades =
    tradeFilter === MY_TRADES_FILTER ? DEMO_MY_TRADES : DEMO_AI_TRADES;

  useEffect(() => {
    if (!isWin) return;
    confetti({
      particleCount: 120,
      spread: 90,
      startVelocity: 40,
      origin: { y: 0.3 },
    });
  }, [isWin]);

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
            {DEMO_DUEL_RESULT.name}
            <span className="bg-border-neutral-muted mx-1.5 h-3 w-px" />
            <CalendarIcon
              width={13}
              height={13}
              className="text-icon-accent mr-0.5"
            />
            {DEMO_DUEL_RESULT.startDate} ~ {DEMO_DUEL_RESULT.endDate}
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
                {formatSignedPercent(DEMO_DUEL_RESULT.myReturnPercent)}
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
                {formatSignedPercent(DEMO_DUEL_RESULT.aiReturnPercent)}
              </span>
            </div>
          </div>

          <div className="border-border-neutral-muted mt-3 w-full rounded-xl border px-2 pt-14 pb-2">
            <DuelCompareReturnChart data={DEMO_COMPARE_HISTORY} />
          </div>
        </div>

        <Link
          href={`/duel/${id}/report`}
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
            {trades.map((trade) => (
              <DuelTradeCard
                key={trade.tradeId}
                {...trade}
                isAiTrade={tradeFilter === AI_TRADES_FILTER}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
