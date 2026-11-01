import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ModelCount } from "@/features/ai/schemas/aiVsAiDuelCreationFormSchema";
import {
  createEmptyAiAgentStrategy,
  type AiAgentStrategy,
} from "@/features/ai/types/aiStrategy";
import { safeSessionStorage } from "@/shared/utils/safeSessionStorage";

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
  hydrated: boolean;
  aiVsAiFlow: AiVsAiFlowState | null;
  startAiVsAiFlow: (draft: AiVsAiDuelDraft) => void;
  updateCurrentAgent: (partial: Partial<AiAgentStrategy>) => void;
  setCurrentAgentIndex: (index: number) => void;
  clearAiVsAiFlow: () => void;
}

export const useDuelCreationDraftStore = create<DuelCreationDraftStore>()(
  persist(
    (set) => ({
      hydrated: false,
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
      clearAiVsAiFlow: () => set({ aiVsAiFlow: null }),
    }),
    {
      name: "duel-creation-draft-store",
      skipHydration: true,
      storage: createJSONStorage(() => safeSessionStorage),
      partialize: ({ aiVsAiFlow }) => ({ aiVsAiFlow }),
    },
  ),
);

let hydration: Promise<void> | undefined;

export function hydrateDuelCreationDraftStore(): Promise<void> {
  if (hydration) return hydration;
  hydration = Promise.resolve(useDuelCreationDraftStore.persist.rehydrate())
    .catch(() => {
      // 손상된 저장 데이터는 기본값으로 대체
    })
    .then(() => {
      useDuelCreationDraftStore.setState({ hydrated: true });
    });
  return hydration;
}
