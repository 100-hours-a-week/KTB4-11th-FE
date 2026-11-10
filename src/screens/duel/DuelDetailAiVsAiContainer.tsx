"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AiVsAiCompareReturnChart,
  type AiVsAiCompareChartPoint,
} from "@/features/ai/components/AiVsAiCompareReturnChart";
import { AiVsAiAgentCards } from "@/features/ai/components/AiVsAiAgentCards";
import { DuelAiTradeCard } from "@/features/ai/components/DuelAiTradeCard";
import { DuelReadyEmptyState } from "@/features/ai/components/DuelReadyEmptyState";
import { useAiVsAiDuelDetailQuery } from "@/features/ai/hooks/useAiVsAiDuelDetailQuery";
import { useCompetitionExecutionsInfiniteQuery } from "@/features/ai/hooks/useCompetitionExecutionsInfiniteQuery";
import { FilterChips } from "@/shared/components/FilterChips";
import FireIcon from "@/assets/icons/fill/fire.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import BasketFlusteredIcon from "@/assets/icons/stockspoon/basket-flustered.svg";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";

const EMPTY_CHART_DATA: AiVsAiCompareChartPoint[] = [];

interface DuelDetailAiVsAiContainerProps {
  id: string;
}

export function DuelDetailAiVsAiContainer({
  id,
}: DuelDetailAiVsAiContainerProps) {
  const router = useRouter();
  const [strategyAgentLabel, setStrategyAgentLabel] = useState("AI 1");
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const { data: detail } = useAiVsAiDuelDetailQuery(id);
  const agentLabels = (detail?.agents ?? []).map((agent) => agent.agentLabel);
  const [selectedAgent, setSelectedAgent] = useState(agentLabels[0]);
  const selectedParticipant = detail?.agents.find(
    (agent) => agent.agentLabel === (selectedAgent ?? agentLabels[0]),
  );
  const executions = useCompetitionExecutionsInfiniteQuery(
    selectedParticipant?.accountId,
  );
  const trades = (executions.data?.pages ?? []).flatMap((page) => page.trades);
  const sentinelRef = useInfiniteScroll({
    hasMore: executions.hasNextPage && !executions.isFetchingNextPage,
    onLoadMore: () => executions.fetchNextPage(),
  });

  if (!detail) return null;

  if (detail.state === "ready") {
    return <DuelReadyEmptyState />;
  }

  const maxReturnPercent = Math.max(
    ...detail.agents.map((agent) => agent.returnPercent ?? 0),
  );
  const leaders = detail.agents.filter(
    (agent) => (agent.returnPercent ?? 0) === maxReturnPercent,
  );
  const isTied = leaders.length > 1;
  const leader = leaders[0];
  const strategyAgent =
    detail.agents.find((agent) => agent.agentLabel === strategyAgentLabel) ??
    detail.agents[0];

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
              <span className="caption-1-regular text-text-neutral-secondary flex items-center">
                {isTied ? (
                  <>
                    현재 동률
                    <span className="bg-border-neutral-muted mx-1.5 h-3 w-px" />
                    {leaders.map((agent) => agent.agentLabel).join(", ")}
                  </>
                ) : (
                  "현재 선두"
                )}
              </span>
              <h2 className="body-1-bold">
                {isTied
                  ? "지금은 동률이에요"
                  : `${leader.agentLabel}가 앞서고 있어요`}
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
                data={detail.chartData ?? EMPTY_CHART_DATA}
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
              trades.map((trade) => (
                <DuelAiTradeCard
                  key={trade.tradeId}
                  {...trade}
                  accountId={selectedParticipant?.accountId}
                />
              ))
            )}
            <div ref={sentinelRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
