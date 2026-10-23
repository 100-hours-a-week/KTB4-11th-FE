"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  isInsufficientCashError,
  isInsufficientSharesError,
  useCreateOrderMutation,
} from "@/features/stock/hooks/useCreateOrderMutation";
import type {
  StockPriceMode,
  StockTradeResult,
  StockTradeSide,
} from "@/features/stock/types/stockTrade";

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

  function submitOrder({
    price,
    quantity,
    priceMode,
  }: {
    price: number;
    quantity: number;
    priceMode: StockPriceMode;
  }) {
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
          const isFilled = data.order_status === "executed";
          setResult({
            type: "success",
            price: isFilled
              ? (data.executions[0]?.execution_price ?? price)
              : price,
            quantity: data.quantity,
            priceMode,
            isFilled,
            pendingNextSession: !isFilled && !isRegularMarket,
          });
        },
        onError: (error) => {
          if (isInsufficientCashError(error)) {
            const shortfall = price * quantity - availableCash;
            setResult({ type: "insufficient-cash", shortfall });
            return;
          }
          if (isInsufficientSharesError(error)) {
            setResult({ type: "insufficient-shares" });
            return;
          }
          toast.error("주문을 접수하지 못했어요. 다시 시도해 주세요.");
        },
      },
    );
  }
  return { result, setResult, submitOrder };
}
