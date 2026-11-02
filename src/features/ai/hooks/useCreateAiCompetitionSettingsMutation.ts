"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postAiCompetitionSettings } from "@/features/ai/api/postAiCompetitionSettings";
import type { CreateAiCompetitionSettingsResponse } from "@/features/ai/types/duel";

interface CreateAiCompetitionSettingsMutationOptions {
  onSuccess?: (data: CreateAiCompetitionSettingsResponse) => void;
  onError?: () => void;
}

export function useCreateAiCompetitionSettingsMutation(
  options?: CreateAiCompetitionSettingsMutationOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAiCompetitionSettings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      options?.onSuccess?.(data);
    },
    onError: () => {
      toast.error("에이전트 설정을 저장하지 못했어요. 다시 시도해 주세요.");
      options?.onError?.();
    },
  });
}
