"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { postOnboarding } from "@/features/account/api/postOnboarding";
import type { CreateAccountResponse } from "@/features/account/types/account";

interface OnboardingMutationOptions {
  onSuccess?: (data: CreateAccountResponse) => void;
}

export function useOnboardingMutation(options?: OnboardingMutationOptions) {
  return useMutation({
    mutationFn: postOnboarding,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: () => {
      toast.error("온보딩을 완료하지 못했어요. 다시 시도해 주세요.");
    },
  });
}
