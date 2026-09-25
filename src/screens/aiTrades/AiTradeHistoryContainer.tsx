"use client";

import { useState } from "react";
import {
  AiTradeFilterChips,
  type AiTradeFilterValue,
} from "@/features/ai/components/AiTradeFilterChips";
import { AiTradeCard } from "@/features/ai/components/AiTradeCard";
import type { AiTrade } from "@/features/ai/types/aiTrade";
import RobotFlusteredIcon from "@/assets/icons/stockspoon/robot-flustered.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { Header, HeaderBackButton } from "@/shared/components/Header";

const MOCK_TRADES: AiTrade[] = [
  {
    stockName: "SK하이닉스",
    tradeType: "매도",
    tradeDate: "2026.09.03 14:20",
    quantity: 2,
    price: 196_000,
    reasoning: "목표 수익률에 도달하고 상승 흐름이 약해져 매도했어요.",
    realizedProfit: 18_400,
    profitRate: 4.9,
  },
  {
    stockName: "삼성전자",
    tradeType: "매수",
    tradeDate: "2026.08.27 10:14",
    quantity: 3,
    price: 72_400,
    reasoning: "추세 상승과 거래량 증가를 확인해 매수했어요.",
    realizedProfit: 0,
    profitRate: 0,
  },
  {
    stockName: "카카오",
    tradeType: "매수",
    tradeDate: "2026.08.26 09:38",
    quantity: 15,
    price: 43_000,
    reasoning: "업종 비중을 나누기 위해 플랫폼 종목을 담았어요.",
    realizedProfit: 0,
    profitRate: 0,
  },
  {
    stockName: "NAVER",
    tradeType: "매도",
    tradeDate: "2026.08.20 11:05",
    quantity: 4,
    price: 221_500,
    reasoning: "실적 우려로 하락 흐름이 이어져 손실을 제한했어요.",
    realizedProfit: -6_000,
    profitRate: -0.8,
  },
  {
    stockName: "LG에너지솔루션",
    tradeType: "매수",
    tradeDate: "2026.08.14 13:42",
    quantity: 1,
    price: 412_000,
    reasoning: "배터리 업황 반등 신호를 확인해 매수했어요.",
    realizedProfit: 0,
    profitRate: 0,
  },
  {
    stockName: "카카오",
    tradeType: "매도",
    tradeDate: "2026.08.05 15:10",
    quantity: 10,
    price: 45_200,
    reasoning: "목표 수익률에 도달해 일부 물량을 매도했어요.",
    realizedProfit: 17_000,
    profitRate: 3.9,
  },
];

export function AiTradeHistoryContainer() {
  const [filter, setFilter] = useState<AiTradeFilterValue>("전체");

  const filteredTrades = MOCK_TRADES.filter(
    (trade) => filter === "전체" || trade.tradeType === filter,
  );

  return (
    <div className="pt-safe-top flex h-full flex-col">
      <Header
        title="AI 매매 내역"
        className="px-5 py-3"
        left={<HeaderBackButton />}
      />

      <div className="flex flex-1 flex-col gap-4 px-5 pt-4 pb-8">
        <AiTradeFilterChips value={filter} onChange={setFilter} />

        {filteredTrades.length === 0 ? (
          <div className="bg-bg-layer-default flex flex-1 flex-col items-center rounded-2xl pt-32">
            <EmptyState
              icon={RobotFlusteredIcon}
              message={
                filter === "전체"
                  ? "매매 내역이 없어요"
                  : `${filter} 내역이 없어요`
              }
              description="AI가 매매를 진행하면 여기에 표시돼요"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredTrades.map((trade) => (
              <AiTradeCard key={trade.stockName + trade.tradeDate} {...trade} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
