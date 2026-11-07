"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CrownIcon from "@/assets/icons/fill/crown.svg";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import HandshakeIcon from "@/assets/icons/fill/handshake.svg";
import BasketFlusteredIcon from "@/assets/icons/stockspoon/basket-flustered.svg";
import { AiVsAiAgentCards } from "@/features/ai/components/AiVsAiAgentCards";
import { AiVsAiCompareReturnChart } from "@/features/ai/components/AiVsAiCompareReturnChart";
import { DuelResultHeading } from "@/features/ai/components/DuelResultHeading";
import { DuelResultNotCompletedEmptyState } from "@/features/ai/components/DuelResultNotCompletedEmptyState";
import { DuelAiTradeCard } from "@/features/ai/components/DuelAiTradeCard";
import { useAiVsAiDuelResultQuery } from "@/features/ai/hooks/useAiVsAiDuelResultQuery";
import { useCompetitionExecutionsInfiniteQuery } from "@/features/ai/hooks/useCompetitionExecutionsInfiniteQuery";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { FilterChips } from "@/shared/components/FilterChips";
import { EmptyState } from "@/shared/components/EmptyState";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { trackEvent } from "@/shared/utils/analytics";

interface DuelResultAiVsAiContainerProps {
  id: string;
}

export function DuelResultAiVsAiContainer({
  id,
}: DuelResultAiVsAiContainerProps) {
  const router = useRouter();
  const [strategyAgentLabel, setStrategyAgentLabel] = useState("AI 1");
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const { data: result, error } = useAiVsAiDuelResultQuery(id);
  const agentLabels = (result?.agents ?? []).map((agent) => agent.agentLabel);
  const [selectedAgent, setSelectedAgent] = useState(agentLabels[0]);
  const selectedParticipant = result?.agents.find(
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
      <DuelResultNotCompletedEmptyState
        onViewDetail={() => router.replace(`/duel/ai-vs-ai/${id}`)}
      />
    );
  }

  if (!result) return null;

  const strategyAgent =
    result.agents.find((agent) => agent.agentLabel === strategyAgentLabel) ??
    result.agents[0];

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
              icon={result.isDraw ? HandshakeIcon : CrownIcon}
              iconClassName={
                result.isDraw ? "text-text-accent" : "text-[#FFD500]"
              }
              title={
                result.isDraw
                  ? "이번 대결은 비겼어요"
                  : `${result.winnerLabel}가 이겼어요`
              }
              name={result.name}
              startDate={result.startDate}
              endDate={result.endDate}
            />
          </div>
          <AiVsAiAgentCards
            agents={result.agents}
            strategyAgentLabel={strategyAgentLabel}
            isStrategyOpen={isStrategyOpen}
            setStrategyAgentLabel={setStrategyAgentLabel}
            setIsStrategyOpen={setIsStrategyOpen}
            winnerLabel={result.isDraw ? undefined : result.winnerLabel}
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
                data={result.chartData}
                agents={isStrategyOpen ? [strategyAgent] : result.agents}
              />
            </div>
          </div>
        </section>
        <div className="flex flex-col gap-2">
          {result.agents.map((agent) => (
            <Link
              key={agent.agentLabel}
              href={`/duel/${id}/report?agent=${encodeURIComponent(agent.agentLabel)}`}
              onClick={() =>
                trackEvent("duel_report_click", { competition_id: id })
              }
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
              options={agentLabels}
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
        </section>
      </div>
    </div>
  );
}
