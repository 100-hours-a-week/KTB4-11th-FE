"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError, type AxiosError } from "axios";
import { postOrder } from "@/features/stock/api/postOrder";
import type { CreateOrderRequest } from "@/features/stock/types/stockTrade";
import type { ApiErrorResponse } from "@/shared/types/apiError";

export function isLegacyAccountOrderError(
  error: unknown,
): error is AxiosError<ApiErrorResponse> {
  return (
    isAxiosError<ApiErrorResponse>(error) &&
    error.response?.status === 403 &&
    error.response?.data?.code === "LEGACY_ACCOUNT_USER_ORDER_NOT_ALLOWED"
  );
}

export function isInsufficientCashError(
  error: unknown,
): error is AxiosError<ApiErrorResponse> {
  return (
    isAxiosError<ApiErrorResponse>(error) &&
    error.response?.status === 409 &&
    error.response?.data?.code === "INSUFFICIENT_CASH"
  );
}

export function isInsufficientSharesError(
  error: unknown,
): error is AxiosError<ApiErrorResponse> {
  return (
    isAxiosError<ApiErrorResponse>(error) &&
    error.response?.status === 409 &&
    error.response?.data?.code === "INSUFFICIENT_AVAILABLE_QUANTITY"
  );
}

export function useCreateOrderMutation(accountId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderRequest) => postOrder(accountId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", accountId] });
      queryClient.invalidateQueries({ queryKey: ["stockHolding", accountId] });
      queryClient.invalidateQueries({ queryKey: ["account", accountId] });
    },
  });
}
