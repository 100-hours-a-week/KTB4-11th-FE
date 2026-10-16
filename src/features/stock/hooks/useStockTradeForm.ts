"use client";

import { useState } from "react";
import type {
  StockPriceMode,
  StockTradeDemo,
  StockTradeField,
  StockTradeInputMode,
  StockTradeResult,
  StockTradeSide,
} from "@/features/stock/types/stockTrade";
import {
  appendTradeDigit,
  getDemoTradeResult,
} from "@/features/stock/utils/stockTrade";

export function useStockTradeForm(
  side: StockTradeSide,
  currentPrice: number,
  demo: StockTradeDemo,
) {
  const [priceMode, setPriceMode] = useState<StockPriceMode>("limit");
  const [priceInput, setPriceInput] = useState(String(currentPrice));
  const [quantityInput, setQuantityInput] = useState("");
  const [field, setField] = useState<StockTradeField>("quantity");
  const [inputMode, setInputMode] = useState<StockTradeInputMode>("number");
  const [result, setResult] = useState<StockTradeResult | null>(null);
  const price = priceMode === "limit" ? Number(priceInput) : currentPrice;
  const quantity = Number(quantityInput);
  const maxQuantity =
    side === "buy"
      ? price > 0
        ? Math.floor(demo.availableCash / price)
        : 0
      : demo.availableQuantity;
  const canSubmit = price > 0 && quantity > 0;

  function selectPriceMode(mode: StockPriceMode) {
    setPriceMode(mode);
    setField(mode === "limit" ? "price" : "quantity");
    setInputMode("number");
  }
  function selectField(next: StockTradeField) {
    setField(next);
    if (next === "price") setPriceMode("limit");
    setInputMode("number");
  }
  function enterKey(key: string) {
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
    if (target === "price") setPriceInput(digits);
    else setQuantityInput(digits);
  }
  function selectQuote(value: number) {
    setPriceMode("limit");
    setPriceInput(String(value));
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
    setResult(getDemoTradeResult({ side, priceMode, price, quantity, demo }));
  }
  return {
    priceMode,
    priceInput,
    quantityInput,
    field,
    inputMode,
    result,
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
