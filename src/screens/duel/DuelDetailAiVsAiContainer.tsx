"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AI_VS_AI_PREVIEW_DETAIL } from "@/features/ai/constants/aiVsAiPreview";
import {
  AiVsAiCompareReturnChart,
  type AiVsAiCompareChartPoint,
} from "@/features/ai/components/AiVsAiCompareReturnChart";
import { AiVsAiAgentCards } from "@/features/ai/components/AiVsAiAgentCards";
import { DuelAiTradeCard } from "@/features/ai/components/DuelAiTradeCard";
import type {
  AiVsAiAgentSummary,
  AiVsAiTrade,
} from "@/features/ai/types/aiVsAiDuelDetail";
import { FilterChips } from "@/shared/components/FilterChips";
import FireIcon from "@/assets/icons/fill/fire.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import BasketFlusteredIcon from "@/assets/icons/stockspoon/basket-flustered.svg";

const CHART_DAYS = 14;

function generateDummyChartData(
  agents: AiVsAiAgentSummary[],
  days: number,
): AiVsAiCompareChartPoint[] {
  const today = new Date();
  const points: AiVsAiCompareChartPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const progress = (days - 1 - i) / (days - 1);

    const values: Record<string, number> = {};
    agents.forEach((agent, index) => {
      const wiggle = Math.sin(index * 3.7 + i * 1.3) * 0.6;
      values[agent.agentLabel] = Number(
        (agent.returnPercent * progress + wiggle).toFixed(2),
      );
    });
    points.push({ date: date.toISOString().slice(0, 10), values });
  }

  const lastPoint = points[points.length - 1];
  agents.forEach((agent) => {
    lastPoint.values[agent.agentLabel] = agent.returnPercent;
  });

  return points;
}

export function DuelAiVsAiDetailContainer() {
  const router = useRouter();
  const [strategyAgentLabel, setStrategyAgentLabel] = useState("AI 1");
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const detail = AI_VS_AI_PREVIEW_DETAIL;
  const leader = [...detail.agents].sort(
    (a, b) => b.returnPercent - a.returnPercent,
  )[0];
  const agentLabels = detail.agents.map((agent) => agent.agentLabel);
  const [selectedAgent, setSelectedAgent] = useState(agentLabels[0]);

  const strategyAgent =
    detail.agents.find((agent) => agent.agentLabel === strategyAgentLabel) ??
    detail.agents[0];

  const trades: AiVsAiTrade[] = detail.trades.filter(
    (trade) => trade.agentLabel === selectedAgent,
  );

  const chartData = generateDummyChartData(detail.agents, CHART_DAYS);

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
        <section
          className="bg-bg-layer-default flex flex-col gap-5 rounded-2xl p-4"
          aria-label="수익률 현황"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="caption-1-regular text-text-neutral-secondary">
                현재 선두
              </span>
              <h2 className="body-1-bold">
                {leader.agentLabel}가 앞서고 있어요
              </h2>
            </div>
            <span className="bg-sky-blue-50 text-text-accent caption-1-semibold rounded-full px-2.5 py-1">
              대결 진행 중
            </span>
          </div>
          <AiVsAiAgentCards
            agents={detail.agents}
            strategyAgentLabel={strategyAgentLabel}
            isStrategyOpen={isStrategyOpen}
            setStrategyAgentLabel={setStrategyAgentLabel}
            setIsStrategyOpen={setIsStrategyOpen}
          />
          <div>
            <div className="flex items-center justify-between">
              <span className="body-2-semibold">
                {isStrategyOpen
                  ? `${strategyAgent.agentLabel} 누적 수익률`
                  : "누적 수익률"}
              </span>
              <span className="caption-1-regular text-text-neutral-secondary">
                시작일 대비
              </span>
            </div>
            <div className="border-border-neutral-muted mt-3 rounded-xl border px-2 pt-14 pb-2">
              <AiVsAiCompareReturnChart
                data={chartData}
                agents={isStrategyOpen ? [strategyAgent] : detail.agents}
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="body-1-bold">AI 매매 내역</span>
            <FilterChips
              options={agentLabels}
              value={selectedAgent}
              onChange={setSelectedAgent}
            />
          </div>
          <div className="flex flex-col gap-2">
            {trades.length === 0 ? (
              <div className="bg-bg-layer-default flex flex-col items-center justify-center rounded-2xl">
                <EmptyState
                  icon={BasketFlusteredIcon}
                  message="아직 매매 내역이 없어요"
                  description="대결이 시작되면 여기 표시돼요"
                />
              </div>
            ) : (
              trades.map((trade) => {
                const { agentLabel: _agentLabel, ...duelTrade } = trade;
                return <DuelAiTradeCard key={trade.tradeId} {...duelTrade} />;
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
