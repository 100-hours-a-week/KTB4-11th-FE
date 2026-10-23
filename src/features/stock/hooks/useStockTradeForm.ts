"use client";

import { useRef, useState } from "react";
import { useInputFeedback } from "@/shared/hooks/useInputFeedback";
import { useStockTradeOrder } from "@/features/stock/hooks/useStockTradeOrder";
import type {
  StockPriceMode,
  StockTradeField,
  StockTradeInputMode,
  StockTradeSide,
} from "@/features/stock/types/stockTrade";
import { appendTradeDigit } from "@/features/stock/utils/stockTrade";

const PRICE_ERROR_DURATION_MS = 2000;

export function useStockTradeForm(
  accountId: number | undefined,
  stockCode: string,
  stockName: string,
  side: StockTradeSide,
  currentPrice: number,
  upperLimitPrice: number | undefined,
  lowerLimitPrice: number | undefined,
  availableCash: number,
  availableQuantity: number,
  isRegularMarket: boolean,
) {
  const [priceMode, setPriceMode] = useState<StockPriceMode>("limit");
  const [priceInput, setPriceInput] = useState(String(currentPrice));
  const [hasEditedPrice, setHasEditedPrice] = useState(false);
  const [lastSyncedPrice, setLastSyncedPrice] = useState(currentPrice);
  // 구매 지정가는 첫 유효 현재가로만 초기화하고 이후 갱신은 사용자가 직접 입력한 값만 유지
  const shouldSyncPrice =
    side === "buy"
      ? lastSyncedPrice <= 0 && currentPrice > 0
      : currentPrice !== lastSyncedPrice;
  if (!hasEditedPrice && shouldSyncPrice) {
    setLastSyncedPrice(currentPrice);
    setPriceInput(String(currentPrice));
  }
  const [quantityInput, setQuantityInput] = useState("");
  const quantityFeedback = useInputFeedback<HTMLSpanElement>();
  const [field, setField] = useState<StockTradeField>("quantity");
  const [inputMode, setInputMode] = useState<StockTradeInputMode>("number");
  const [priceError, setPriceError] = useState<string | null>(null);
  const priceErrorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
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

  const order = useStockTradeOrder({
    accountId,
    stockCode,
    stockName,
    side,
    availableCash,
    isRegularMarket,
  });

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
    if (upperLimitPrice !== undefined && value > upperLimitPrice) {
      showPriceError(
        `이 주식의 최대 가격은 ${upperLimitPrice.toLocaleString()}원이에요`,
      );
      return upperLimitPrice;
    }
    if (lowerLimitPrice !== undefined && value < lowerLimitPrice) {
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
    if (field === "quantity") quantityFeedback.clearError();
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
    } else {
      quantityFeedback.clearError();
      setQuantityInput(digits);
    }
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
    const nextQuantity = Math.floor(maxQuantity * ratio);
    if (maxQuantity >= 1 && nextQuantity < 1) {
      quantityFeedback.showError(
        `1주부터 ${side === "buy" ? "구매" : "판매"}할 수 있어요`,
      );
      setQuantityInput("1");
    } else {
      quantityFeedback.clearError();
      setQuantityInput(String(nextQuantity));
    }
    setField("quantity");
  }
  function submit() {
    if (quantity <= 0) {
      quantityFeedback.showError("수량을 입력해주세요");
      setField("quantity");
      return;
    }
    if (!canSubmit) return;
    quantityFeedback.clearError();
    if (priceMode !== "market") {
      const validatedPrice = clampPriceToLimits(price);
      if (validatedPrice !== price) {
        setPriceInput(String(validatedPrice));
        setField("price");
        return;
      }
    }
    order.submitOrder({ price, quantity, priceMode });
  }

  return {
    priceMode,
    priceInput,
    quantityInput,
    quantityFeedback,
    field,
    inputMode,
    result: order.result,
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
    setResult: order.setResult,
    submit,
  };
}
