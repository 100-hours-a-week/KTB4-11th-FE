"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError, type AxiosError } from "axios";
import { toast } from "sonner";
import { postCompetition } from "@/features/ai/api/postCompetition";
import type { CreateCompetitionResponse } from "@/features/ai/types/duel";
import type { ApiErrorResponse } from "@/shared/types/apiError";

interface CreateCompetitionMutationOptions {
  onSuccess?: (data: CreateCompetitionResponse) => void;
  onError?: (error: unknown) => boolean;
}

export function useCreateCompetitionMutation(
  options?: CreateCompetitionMutationOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCompetition,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const handled = options?.onError?.(error) ?? false;
      if (!handled) {
        toast.error("대결을 생성하지 못했어요. 다시 시도해 주세요.");
      }
    },
  });
}

export function isDuelNameAlreadyExistsError(
  error: unknown,
): error is AxiosError<ApiErrorResponse> {
  return (
    isAxiosError<ApiErrorResponse>(error) &&
    error.response?.status === 409 &&
    error.response?.data?.code === "DUPLICATE_NAME"
  );
}
