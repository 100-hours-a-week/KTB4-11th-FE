"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CrownIcon from "@/assets/icons/fill/crown.svg";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import BasketFlusteredIcon from "@/assets/icons/stockspoon/basket-flustered.svg";
import { AiVsAiAgentCards } from "@/features/ai/components/AiVsAiAgentCards";
import {
  AiVsAiCompareReturnChart,
  type AiVsAiCompareChartPoint,
} from "@/features/ai/components/AiVsAiCompareReturnChart";
import { DuelResultHeading } from "@/features/ai/components/DuelResultHeading";
import { DuelAiTradeCard } from "@/features/ai/components/DuelAiTradeCard";
import { AI_VS_AI_PREVIEW_DETAIL } from "@/features/ai/constants/aiVsAiPreview";
import type { AiVsAiDuelResult } from "@/features/ai/types/aiVsAiDuelDetail";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { FilterChips } from "@/shared/components/FilterChips";
import { EmptyState } from "@/shared/components/EmptyState";

const DUMMY_RESULT: AiVsAiDuelResult = {
  name: AI_VS_AI_PREVIEW_DETAIL.name,
  startDate: "2026.07.01",
  endDate: "2026.07.31",
  winnerLabel: "AI 2",
  agents: [
    {
      ...AI_VS_AI_PREVIEW_DETAIL.agents[0],
      returnPercent: 3.1,
      tradeCount: 18,
      summary: "",
    },
    {
      ...AI_VS_AI_PREVIEW_DETAIL.agents[1],
      returnPercent: 5.8,
      tradeCount: 7,
      summary: "",
    },
    {
      agentLabel: "AI 3",
      returnPercent: -0.8,
      investmentTendency: "위험중립형",
      interestThemes: ["자동차", "식품"],
      excludeThemes: [],
      additionalRequest: "여러 업종에 분산해서 투자해주세요.",
      tradeCount: 12,
      summary: "",
    },
  ],
};

// Preview-only history. Every series starts at zero and ends at its final return.
const PREVIEW_HISTORY: AiVsAiCompareChartPoint[] = Array.from(
  { length: 31 },
  (_, day) => ({
    date: `2026-07-${String(day + 1).padStart(2, "0")}`,
    values: Object.fromEntries(
      DUMMY_RESULT.agents.map((agent, index) => [
        agent.agentLabel,
        Number(
          (
            (agent.returnPercent * day) / 30 +
            Math.sin(day * 1.3 + index) * Math.sin((Math.PI * day) / 30) * 0.6
          ).toFixed(2),
        ),
      ]),
    ),
  }),
);

interface DuelAiVsAiResultContainerProps {
  id: string;
}

export function DuelAiVsAiResultContainer({
  id,
}: DuelAiVsAiResultContainerProps) {
  const router = useRouter();
  const [strategyAgentLabel, setStrategyAgentLabel] = useState("AI 1");
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("AI 1");
  const result = DUMMY_RESULT;
  const agents = result.agents;
  const strategyAgent =
    agents.find((agent) => agent.agentLabel === strategyAgentLabel) ??
    agents[0];
  const trades = AI_VS_AI_PREVIEW_DETAIL.trades
    .filter((trade) => trade.agentLabel === selectedAgent)
    .map((trade) => ({
      ...trade,
      tradeDate: trade.tradeDate.replace(/^8\./, "7."),
    }));

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        className="px-5 py-3"
        title="대결 결과"
        left={<HeaderBackButton onClick={() => router.push("/duel")} />}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pt-4 pb-10">
        <section
          className="bg-bg-layer-default flex flex-col gap-4 rounded-2xl p-4"
          aria-label="대결 결과 요약"
        >
          <div className="flex flex-col items-center gap-1">
            <DuelResultHeading
              icon={CrownIcon}
              iconClassName="text-[#FFD500]"
              title={`${result.winnerLabel}가 이겼어요`}
              name={result.name}
              startDate={result.startDate}
              endDate={result.endDate}
            />
          </div>
          <AiVsAiAgentCards
            agents={agents}
            strategyAgentLabel={strategyAgentLabel}
            isStrategyOpen={isStrategyOpen}
            setStrategyAgentLabel={setStrategyAgentLabel}
            setIsStrategyOpen={setIsStrategyOpen}
            winnerLabel={result.winnerLabel}
          />
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="body-2-semibold">
                {isStrategyOpen
                  ? `${strategyAgent.agentLabel} 기간 수익률`
                  : "기간 수익률 비교"}
              </span>
              <span className="caption-1-regular text-text-neutral-secondary">
                최종 수익률
              </span>
            </div>
            <div className="border-border-neutral-muted mt-3 rounded-xl border px-2 pt-14 pb-2">
              <AiVsAiCompareReturnChart
                data={PREVIEW_HISTORY}
                agents={isStrategyOpen ? [strategyAgent] : agents}
              />
            </div>
          </div>
        </section>
        <div className="flex flex-col gap-2">
          {agents.map((agent) => (
            <Link
              key={agent.agentLabel}
              href={`/duel/${id}/report?agent=${encodeURIComponent(agent.agentLabel)}`}
              className="bg-bg-layer-default flex items-center justify-between rounded-2xl p-4"
            >
              <span className="body-1-semibold">
                {agent.agentLabel} 리포트 보기
              </span>
              <ChevronForwardIcon
                width={20}
                height={20}
                className="text-icon-neutral-secondary"
              />
            </Link>
          ))}
        </div>
        <section className="flex flex-col gap-3" aria-label="AI 매매 내역">
          <div className="flex items-center justify-between gap-2">
            <h2 className="body-1-bold">AI 매매 내역</h2>
            <FilterChips
              options={agents.map((agent) => agent.agentLabel)}
              value={selectedAgent}
              onChange={setSelectedAgent}
            />
          </div>
          <div className="flex flex-col gap-2">
            {trades.length === 0 ? (
              <div className="bg-bg-layer-default rounded-2xl">
                <EmptyState
                  icon={BasketFlusteredIcon}
                  message="AI 매매 내역이 없어요"
                  description="대결 기간 중 진행한 매매가 없어요"
                />
              </div>
            ) : (
              trades.map(({ agentLabel: _agentLabel, ...trade }) => (
                <DuelAiTradeCard key={trade.tradeId} {...trade} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
