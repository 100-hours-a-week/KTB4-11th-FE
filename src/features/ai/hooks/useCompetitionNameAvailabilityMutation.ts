"use client";

import { useMutation } from "@tanstack/react-query";
import { getCompetitionNameAvailability } from "@/features/ai/api/getCompetitionNameAvailability";

export function useCompetitionNameAvailabilityMutation() {
  return useMutation({
    mutationFn: getCompetitionNameAvailability,
  });
}
