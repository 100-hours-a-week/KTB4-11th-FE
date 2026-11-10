"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InvestmentTendencySelector } from "@/features/ai/components/InvestmentTendencySelector";
import { ThemeCascaderField } from "@/features/ai/components/ThemeCascaderField";
import {
  isDuelNameAlreadyExistsError,
  useCreateCompetitionMutation,
} from "@/features/ai/hooks/useCreateCompetitionMutation";
import { useThemesQuery } from "@/features/ai/hooks/useThemesQuery";
import {
  toRiskLevel,
  type AiAgentStrategy,
} from "@/features/ai/types/aiStrategy";
import { useDuelCreationDraftStore } from "@/store/duelCreationDraftStore";
import { Button } from "@/shared/components/Button";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import BuildingApartmentIcon from "@/assets/icons/fill/building-apartment.svg";
import ChartLineIcon from "@/assets/icons/fill/chart-line.svg";
import ChevronBackwardIcon from "@/assets/icons/fill/chevron-backward.svg";
import TelevisionSimpleIcon from "@/assets/icons/fill/television-simple.svg";

const USED_DATA_ITEMS = [
  { icon: TelevisionSimpleIcon, text: "6개 인터넷 신문사에서 발행한 뉴스" },
  { icon: ChartLineIcon, text: "1년 이상 누적된 시장 가격 차트" },
  { icon: BuildingApartmentIcon, text: "전자공시시스템에 등록되는 공시" },
];

export function DuelAiStrategySettingContainer() {
  const router = useRouter();
  const flow = useDuelCreationDraftStore((state) => state.aiVsAiFlow);
  const updateCurrentAgent = useDuelCreationDraftStore(
    (state) => state.updateCurrentAgent,
  );
  const setCurrentAgentIndex = useDuelCreationDraftStore(
    (state) => state.setCurrentAgentIndex,
  );
  const clearAiVsAiFlow = useDuelCreationDraftStore(
    (state) => state.clearAiVsAiFlow,
  );
  const themesQuery = useThemesQuery();
  const themeCategories = themesQuery.data ?? [];

  const createCompetitionMutation = useCreateCompetitionMutation({
    onSuccess: () => {
      toast.success("대결이 생성됐어요");
      router.push("/duel");
    },
    onError: (error) => {
      if (isDuelNameAlreadyExistsError(error)) {
        toast.error("이미 존재하는 대결 이름이에요. 이름을 변경해 주세요.");
        router.push("/duel/create/ai-vs-ai");
        return true;
      }
      return false;
    },
  });

  useEffect(() => {
    if (!flow) {
      router.replace("/duel/create/ai-vs-ai");
    }
  }, [flow, router]);

  useEffect(() => {
    return () => {
      if (createCompetitionMutation.isSuccess) {
        clearAiVsAiFlow();
      }
    };
  }, [createCompetitionMutation.isSuccess, clearAiVsAiFlow]);

  useEffect(() => {
    if (themesQuery.isError) {
      toast.error("테마 목록을 불러오지 못했어요. 다시 시도해 주세요.");
    }
  }, [themesQuery.isError]);

  if (!flow) return null;

  const { agents, currentAgentIndex, modelCount } = flow;
  const current: AiAgentStrategy = agents[currentAgentIndex];
  const isLastAgent = currentAgentIndex === modelCount - 1;
  const isSubmitting = createCompetitionMutation.isPending;
  const hasSelectedThemes =
    current.interestThemes.length > 0 && current.excludeThemes.length > 0;

  function goToPreviousStep() {
    if (currentAgentIndex > 0) {
      setCurrentAgentIndex(currentAgentIndex - 1);
    } else {
      router.push("/duel/create/ai-vs-ai");
    }
  }

  function goToNextStep() {
    if (isLastAgent) {
      if (!flow) return;
      createCompetitionMutation.mutate({
        competition_name: flow.name,
        competition_type: "ai_vs_ai",
        start_date: flow.startDate,
        end_date: flow.endDate,
        initial_capital: flow.amount,
        ai_participant_count: flow.modelCount,
        agents: flow.agents.map((agent) => ({
          risk_level: toRiskLevel(agent.investmentTendency),
          preferred_themes: agent.interestThemes,
          excluded_themes: agent.excludeThemes,
          additional_request: agent.additionalRequest,
        })),
      });
      return;
    }
    setCurrentAgentIndex(currentAgentIndex + 1);
  }

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        title="에이전트 세팅"
        className="px-5 py-3"
        left={<HeaderBackButton onClick={goToPreviousStep} />}
        right={
          <span className="body-2-semibold text-text-neutral-primary">
            {currentAgentIndex + 1}/{modelCount}
          </span>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-5 pt-4">
        <div className="bg-bg-layer-default flex flex-col gap-2 rounded-2xl p-4">
          <span className="body-1-bold">사용하는 데이터</span>
          <ul className="flex flex-col gap-2">
            {USED_DATA_ITEMS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="text-icon-accent size-5 shrink-0" />
                <span className="body-2-regular text-text-neutral-secondary">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <InvestmentTendencySelector
          value={current.investmentTendency}
          onChange={(value) =>
            updateCurrentAgent({ investmentTendency: value })
          }
        />

        <ThemeCascaderField
          label="관심 테마"
          categories={themeCategories}
          value={current.interestThemes}
          onChange={(value) => updateCurrentAgent({ interestThemes: value })}
          excludedValue={current.excludeThemes}
        />

        <ThemeCascaderField
          label="제외 테마"
          categories={themeCategories}
          value={current.excludeThemes}
          onChange={(value) => updateCurrentAgent({ excludeThemes: value })}
          excludedValue={current.interestThemes}
        />

        <div className="flex flex-col gap-3">
          <span className="body-1-bold">추가 요청</span>
          <textarea
            value={current.additionalRequest}
            onChange={(event) =>
              updateCurrentAgent({ additionalRequest: event.target.value })
            }
            placeholder="에이전트에게 전달할 투자 요청을 자유롭게 입력해 주세요"
            rows={4}
            className="bg-bg-layer-default border-border-neutral-muted body-1-medium text-text-neutral-primary placeholder:body-2-regular placeholder:text-text-neutral-tertiary focus:border-border-accent resize-none rounded-2xl border-[1.4px] p-4 outline-none"
          />
        </div>

        <div className="mt-auto mb-8 flex shrink-0 gap-2">
          {currentAgentIndex > 0 && (
            <button
              type="button"
              onClick={goToPreviousStep}
              aria-label="이전 단계"
              className="bg-bg-layer-default border-border-neutral-muted flex size-[54px] shrink-0 items-center justify-center rounded-2xl border"
            >
              <ChevronBackwardIcon className="text-icon-neutral-secondary size-6" />
            </button>
          )}
          <Button
            className="flex-1"
            onClick={goToNextStep}
            disabled={!hasSelectedThemes || (isLastAgent && isSubmitting)}
          >
            {isLastAgent ? "대결 시작" : "다음"}
          </Button>
        </div>
      </div>
    </div>
  );
}
