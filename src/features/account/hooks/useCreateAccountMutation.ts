"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError, type AxiosError } from "axios";
import { toast } from "sonner";
import { postAccount } from "@/features/account/api/postAccount";
import type { CreateAccountResponse } from "@/features/account/types/account";
import type { ApiErrorResponse } from "@/shared/types/apiError";

interface CreateAccountMutationOptions {
  onSuccess?: (data: CreateAccountResponse) => void;
  onError?: (error: unknown) => boolean;
}

export function useCreateAccountMutation(
  options?: CreateAccountMutationOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAccount,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const handled = options?.onError?.(error) ?? false;
      if (!handled) {
        toast.error("계좌를 생성하지 못했어요. 다시 시도해 주세요.");
      }
    },
  });
}

export function isAccountNameAlreadyExistsError(
  error: unknown,
): error is AxiosError<ApiErrorResponse> {
  return (
    isAxiosError<ApiErrorResponse>(error) &&
    error.response?.status === 409 &&
    error.response?.data?.code === "ACCOUNT_NAME_ALREADY_EXISTS"
  );
}
