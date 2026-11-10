"use client";

import { useId } from "react";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import CrownIcon from "@/assets/icons/fill/crown.svg";
import { AiVsAiStrategyPanel } from "@/features/ai/components/AiVsAiStrategyPanel";
import { TENDENCY_DOT_COLORS } from "@/features/ai/constants/investmentTendencyColors";
import type { AiVsAiAgentSummary } from "@/features/ai/types/aiVsAiDuelDetail";
import { formatSignedPercent } from "@/shared/utils/getReturnRateInfo";

interface AiVsAiAgentCardsProps {
  agents: AiVsAiAgentSummary[];
  strategyAgentLabel: string;
  isStrategyOpen: boolean;
  setStrategyAgentLabel: (label: string) => void;
  setIsStrategyOpen: (open: boolean) => void;
  winnerLabel?: string;
}

export function AiVsAiAgentCards({
  agents,
  strategyAgentLabel,
  isStrategyOpen,
  setStrategyAgentLabel,
  setIsStrategyOpen,
  winnerLabel,
}: AiVsAiAgentCardsProps) {
  const panelId = useId();
  const strategyAgent =
    agents.find((agent) => agent.agentLabel === strategyAgentLabel) ??
    agents[0];
  return (
    <div>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${agents.length}, minmax(0, 1fr))`,
        }}
      >
        {agents.map((agent) => (
          <button
            key={agent.agentLabel}
            aria-expanded={
              isStrategyOpen && strategyAgentLabel === agent.agentLabel
            }
            aria-controls={panelId}
            onClick={() => {
              setStrategyAgentLabel(agent.agentLabel);
              setIsStrategyOpen(
                !isStrategyOpen || strategyAgentLabel !== agent.agentLabel,
              );
            }}
            type="button"
            aria-label={`${agent.agentLabel} 전략 보기`}
            className={`hover:bg-sky-blue-50 focus-visible:outline-text-accent flex min-w-0 cursor-pointer flex-col gap-2 rounded-xl px-3 py-4 text-left transition-[background-color,box-shadow] duration-200 ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 ${isStrategyOpen && strategyAgentLabel === agent.agentLabel ? "bg-sky-blue-50 ring-text-accent ring-1" : "bg-bg-layer-basement"}`}
          >
            <div className="caption-1-semibold flex items-center gap-1.5">
              <span
                className={`size-2 shrink-0 rounded-full ${TENDENCY_DOT_COLORS[agent.investmentTendency]}`}
              />
              {agent.agentLabel}
              {agent.agentLabel === winnerLabel && (
                <CrownIcon
                  width={12}
                  height={12}
                  className="shrink-0 text-[#FFD500]"
                  aria-label="우승"
                />
              )}
            </div>
            {agent.returnPercent !== null && (
              <span
                className={`text-xl font-bold tracking-tight tabular-nums ${agent.returnPercent >= 0 ? "text-text-accent" : "text-text-neutral-secondary"}`}
              >
                {formatSignedPercent(agent.returnPercent)}
              </span>
            )}
            <span className="caption-1-regular text-text-neutral-secondary">
              {agent.investmentTendency}
            </span>
            <span className="caption-1-semibold text-text-accent flex items-center gap-1">
              {isStrategyOpen && strategyAgentLabel === agent.agentLabel
                ? "전략 접기"
                : "전략 보기"}
              <ChevronForwardIcon
                width={8}
                height={8}
                aria-hidden="true"
                className={`shrink-0 transition-transform duration-300 motion-reduce:transition-none ${isStrategyOpen && strategyAgentLabel === agent.agentLabel ? "rotate-90" : ""}`}
              />
            </span>
          </button>
        ))}
      </div>
      <AiVsAiStrategyPanel
        id={panelId}
        agent={strategyAgent}
        open={isStrategyOpen}
      />
    </div>
  );
}
