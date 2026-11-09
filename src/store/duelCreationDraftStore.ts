import { create } from "zustand";
import type { ModelCount } from "@/features/ai/schemas/aiVsAiDuelCreationFormSchema";
import {
  createEmptyAiAgentStrategy,
  type AiAgentStrategy,
} from "@/features/ai/types/aiStrategy";

export interface AiVsAiDuelDraft {
  name: string;
  startDate: string;
  endDate: string;
  amount: number;
  modelCount: ModelCount;
}

export interface AiVsAiFlowState extends AiVsAiDuelDraft {
  agents: AiAgentStrategy[];
  currentAgentIndex: number;
}

interface DuelCreationDraftStore {
  aiVsAiFlow: AiVsAiFlowState | null;
  startAiVsAiFlow: (draft: AiVsAiDuelDraft) => void;
  updateCurrentAgent: (partial: Partial<AiAgentStrategy>) => void;
  setCurrentAgentIndex: (index: number) => void;
}

export const useDuelCreationDraftStore = create<DuelCreationDraftStore>(
  (set) => ({
    aiVsAiFlow: null,
    startAiVsAiFlow: (draft) =>
      set({
        aiVsAiFlow: {
          ...draft,
          agents: Array.from({ length: draft.modelCount }, () =>
            createEmptyAiAgentStrategy(),
          ),
          currentAgentIndex: 0,
        },
      }),
    updateCurrentAgent: (partial) =>
      set((state) => {
        if (!state.aiVsAiFlow) return state;
        const { agents, currentAgentIndex } = state.aiVsAiFlow;
        return {
          aiVsAiFlow: {
            ...state.aiVsAiFlow,
            agents: agents.map((agent, index) =>
              index === currentAgentIndex ? { ...agent, ...partial } : agent,
            ),
          },
        };
      }),
    setCurrentAgentIndex: (index) =>
      set((state) =>
        state.aiVsAiFlow
          ? { aiVsAiFlow: { ...state.aiVsAiFlow, currentAgentIndex: index } }
          : state,
      ),
  }),
);
