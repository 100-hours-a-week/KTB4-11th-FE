"use client";

import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getOrderRequestStatus } from "@/features/stock/api/getOrderRequestStatus";
import {
  isInsufficientCashError,
  isInsufficientSharesError,
  isLegacyAccountOrderError,
  useCreateOrderMutation,
} from "@/features/stock/hooks/useCreateOrderMutation";
import type {
  StockPriceMode,
  StockTradeResult,
  StockTradeSide,
} from "@/features/stock/types/stockTrade";
import type { ApiErrorResponse } from "@/shared/types/apiError";
import { trackEvent } from "@/shared/utils/analytics";

const POLL_INTERVAL_MS = 1000;
const POLL_TIMEOUT_MS = 15_000;

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// 주문 API 호출과 성공·실패 결과 화면 상태를 관리
export function useStockTradeOrder({
  accountId,
  stockCode,
  stockName,
  side,
  availableCash,
  isRegularMarket,
}: {
  accountId: number | undefined;
  stockCode: string;
  stockName: string;
  side: StockTradeSide;
  availableCash: number;
  isRegularMarket: boolean;
}) {
  const [result, setResult] = useState<StockTradeResult | null>(null);
  const createOrderMutation = useCreateOrderMutation(accountId);
  const queryClient = useQueryClient();
  const unmountedRef = useRef(false);

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  // SQS 비동기 처리라 생성 응답에 결과가 없어, request_id로 완료될 때까지 재조회
  async function pollOrderResult({
    requestId,
    price,
    priceMode,
  }: {
    requestId: string;
    price: number;
    priceMode: StockPriceMode;
  }) {
    const deadline = Date.now() + POLL_TIMEOUT_MS;

    while (Date.now() < deadline) {
      if (unmountedRef.current) return;

      const status = await getOrderRequestStatus(accountId!, requestId);
      if (status.status === "created") {
        const isFilled = status.order_status === "executed";
        trackEvent("trade_success", {
          stock_code: stockCode,
          side,
          is_filled: isFilled,
        });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["orders", accountId] }),
          queryClient.invalidateQueries({
            queryKey: ["orders", "infinite", accountId],
          }),
          queryClient.invalidateQueries({
            queryKey: ["stockHolding", accountId],
          }),
          queryClient.invalidateQueries({ queryKey: ["account", accountId] }),
        ]);
        if (!unmountedRef.current) {
          setResult({
            type: "success",
            price: isFilled ? (status.execution_price ?? price) : price,
            quantity: status.quantity,
            priceMode,
            isFilled,
            pendingNextSession: !isFilled && !isRegularMarket,
          });
        }
        return;
      }

      await wait(POLL_INTERVAL_MS);
    }

    if (!unmountedRef.current) setResult({ type: "processing-timeout" });
  }

  function submitOrder({
    price,
    quantity,
    priceMode,
  }: {
    price: number;
    quantity: number;
    priceMode: StockPriceMode;
  }) {
    trackEvent("trade_attempt", {
      stock_code: stockCode,
      side,
      price_mode: priceMode,
    });
    createOrderMutation.mutate(
      {
        stock_code: stockCode,
        stock_name: stockName,
        order_side: side,
        order_type: priceMode === "market" ? "market" : "limit",
        limit_price: priceMode === "market" ? null : price,
        quantity,
      },
      {
        onSuccess: (data) => {
          setResult({ type: "processing" });
          void pollOrderResult({
            requestId: data.request_id,
            price,
            priceMode,
          });
        },
        onError: (error) => {
          const errorCode = isAxiosError<ApiErrorResponse>(error)
            ? error.response?.data?.code
            : undefined;
          trackEvent("trade_fail", {
            stock_code: stockCode,
            side,
            error_code: errorCode,
          });
          if (isLegacyAccountOrderError(error)) {
            setResult({ type: "legacy-account" });
            return;
          }
          if (isInsufficientCashError(error)) {
            const shortfall = price * quantity - availableCash;
            setResult({ type: "insufficient-cash", shortfall });
            return;
          }
          if (isInsufficientSharesError(error)) {
            setResult({ type: "insufficient-shares" });
            return;
          }
          const message = isAxiosError<ApiErrorResponse>(error)
            ? error.response?.data?.message
            : undefined;
          toast.error(
            message ?? "주문을 접수하지 못했어요. 다시 시도해 주세요.",
          );
        },
      },
    );
  }
  return { result, setResult, submitOrder };
}
