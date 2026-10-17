"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  isInsufficientCashError,
  isInsufficientSharesError,
  useCreateOrderMutation,
} from "@/features/stock/hooks/useCreateOrderMutation";
import type {
  StockPriceMode,
  StockTradeField,
  StockTradeInputMode,
  StockTradeResult,
  StockTradeSide,
} from "@/features/stock/types/stockTrade";
import {
  appendTradeDigit,
  getPriceLimits,
} from "@/features/stock/utils/stockTrade";

const PRICE_ERROR_DURATION_MS = 2000;

export function useStockTradeForm(
  accountId: number | undefined,
  stockCode: string,
  stockName: string,
  side: StockTradeSide,
  currentPrice: number,
  changeRate: number,
  availableCash: number,
  availableQuantity: number,
  isRegularMarket: boolean,
) {
  const [priceMode, setPriceMode] = useState<StockPriceMode>("limit");
  const [priceInput, setPriceInput] = useState(String(currentPrice));
  const [hasEditedPrice, setHasEditedPrice] = useState(false);
  const [lastSyncedPrice, setLastSyncedPrice] = useState(currentPrice);
  if (!hasEditedPrice && currentPrice !== lastSyncedPrice) {
    setLastSyncedPrice(currentPrice);
    setPriceInput(String(currentPrice));
  }
  const [quantityInput, setQuantityInput] = useState("");
  const [field, setField] = useState<StockTradeField>("quantity");
  const [inputMode, setInputMode] = useState<StockTradeInputMode>("number");
  const [result, setResult] = useState<StockTradeResult | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const priceErrorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const { upperLimitPrice, lowerLimitPrice } = getPriceLimits(
    currentPrice,
    changeRate,
  );
  const price = priceMode === "limit" ? Number(priceInput) : currentPrice;
  const quantity = Number(quantityInput);
  const maxQuantity =
    side === "buy"
      ? price > 0
        ? Math.floor(availableCash / price)
        : 0
      : availableQuantity;
  const canSubmit = price > 0 && quantity > 0;

  const createOrderMutation = useCreateOrderMutation(accountId);

  function showPriceError(message: string) {
    setPriceError(message);
    if (priceErrorTimeoutRef.current)
      clearTimeout(priceErrorTimeoutRef.current);
    priceErrorTimeoutRef.current = setTimeout(
      () => setPriceError(null),
      PRICE_ERROR_DURATION_MS,
    );
  }
  function clampPriceToLimits(value: number): number {
    if (value > upperLimitPrice) {
      showPriceError(
        `이 주식의 최대 가격은 ${upperLimitPrice.toLocaleString()}원이에요`,
      );
      return upperLimitPrice;
    }
    if (value < lowerLimitPrice) {
      showPriceError(
        `이 주식의 최소 가격은 ${lowerLimitPrice.toLocaleString()}원이에요`,
      );
      return lowerLimitPrice;
    }
    return value;
  }
  function selectPriceMode(mode: StockPriceMode) {
    setPriceMode(mode);
    setField(mode === "limit" ? "price" : "quantity");
    setInputMode("number");
  }
  function selectField(next: StockTradeField) {
    if (field === "price" && next !== "price" && priceInput !== "") {
      setPriceInput(String(clampPriceToLimits(Number(priceInput))));
    }
    setField(next);
    if (next === "price") setPriceMode("limit");
    setInputMode("number");
  }
  function enterKey(key: string) {
    if (field === "price") {
      setPriceError(null);
      setHasEditedPrice(true);
    }
    const setValue = field === "price" ? setPriceInput : setQuantityInput;
    setValue((value) =>
      key === "delete" ? value.slice(0, -1) : appendTradeDigit(value, key),
    );
  }
  function changeInput(target: StockTradeField, value: string) {
    const digits = value
      .replace(/[^0-9]/g, "")
      .replace(/^0+/, "")
      .slice(0, 9);
    if (target === "price") {
      setPriceError(null);
      setHasEditedPrice(true);
      setPriceInput(digits);
    } else setQuantityInput(digits);
  }
  function selectQuote(value: number) {
    setHasEditedPrice(true);
    setPriceMode("limit");
    setPriceInput(String(clampPriceToLimits(value)));
  }
  function adjustPrice(delta: number) {
    selectQuote(Math.max(1, price + delta));
  }
  function selectRatio(ratio: number) {
    setQuantityInput(String(Math.floor(maxQuantity * ratio)));
    setField("quantity");
  }
  function submit() {
    if (!canSubmit) return;
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
  return {
    priceMode,
    priceInput,
    quantityInput,
    field,
    inputMode,
    result,
    priceError,
    price,
    quantity,
    maxQuantity,
    canSubmit,
    selectPriceMode,
    selectField,
    enterKey,
    changeInput,
    selectQuote,
    adjustPrice,
    selectRatio,
    setInputMode,
    setResult,
    submit,
  };
}
