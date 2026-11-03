"use client";

import { useMutation } from "@tanstack/react-query";
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

// 주문 생성 응답은 접수(accepted) 확인일 뿐이라 캐시 무효화는 폴링으로 실제 생성 확인 후 처리
export function useCreateOrderMutation(accountId: number | undefined) {
  return useMutation({
    mutationFn: (payload: CreateOrderRequest) => postOrder(accountId!, payload),
  });
}
