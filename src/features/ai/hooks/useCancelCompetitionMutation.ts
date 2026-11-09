"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelCompetition } from "@/features/ai/api/cancelCompetition";

export function useCancelCompetitionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelCompetition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
