"use client";

import { formatKoreanWon } from "@/shared/utils/formatKoreanWon";
import { useMemo } from "react";
import { cn } from "@/shared/utils/cn";
import { useRouter } from "next/navigation";
import { NumberKeypad } from "@/features/stock/components/trade/NumberKeypad";
import { StockTradeOrderBook } from "@/features/stock/components/trade/StockTradeOrderBook";
import { StockTradePriceInput } from "@/features/stock/components/trade/StockTradePriceInput";
import { StockTradeQuantityInput } from "@/features/stock/components/trade/StockTradeQuantityInput";
import { StockTradeResultSheet } from "@/features/stock/components/trade/StockTradeResultSheet";
import { useStockTradeForm } from "@/features/stock/hooks/useStockTradeForm";
import {
  DEMO_HOLDING_STOCK_CODES,
  DEMO_STOCK_INFO,
} from "@/features/stock/mocks/stockDetail";
import { getStockTradeDemo } from "@/features/stock/mocks/stockTrade";
import type { StockTradeSide } from "@/features/stock/types/stockTrade";
import { Button } from "@/shared/components/Button";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

interface StockTradeContainerProps {
  code: string;
  side: StockTradeSide;
}

export function StockTradeContainer({ code, side }: StockTradeContainerProps) {
  const router = useRouter();
  const stock = DEMO_STOCK_INFO[code] ?? DEMO_STOCK_INFO["035420"];
  const demo = useMemo(
    () =>
      getStockTradeDemo(
        stock.price,
        DEMO_HOLDING_STOCK_CODES.has(stock.stockCode),
      ),
    [stock.price, stock.stockCode],
  );
  const form = useStockTradeForm(side, stock.price, demo);
  const action = side === "buy" ? "구매" : "판매";
  const { colorClass } = getReturnRateInfo(stock.changeRate);
  const availability =
    side === "buy"
      ? `구매가능 ${demo.availableCash.toLocaleString()}원${form.priceMode === "market" ? "" : ` · 최대 ${form.maxQuantity.toLocaleString()}주`}`
      : `판매가능 최대 ${form.maxQuantity.toLocaleString()}주`;
  const quantityDescription =
    form.quantity > 0
      ? `${form.priceMode === "limit" ? "총" : form.priceMode === "market" ? (side === "buy" ? "최대" : "최소") : "예상"} ${formatKoreanWon(form.price * form.quantity)}`
      : availability;

  return (
    <div
      className="bg-page-gradient pt-screen-top flex h-full flex-col"
      onKeyDown={(event) => {
        if (
          form.result ||
          (event.target as HTMLElement).tagName === "INPUT" ||
          (event.target as HTMLElement).closest('[role="dialog"]')
        )
          return;
        if (/^[0-9]$/.test(event.key)) {
          event.preventDefault();
          form.enterKey(event.key);
        }
        if (event.key === "Backspace") {
          event.preventDefault();
          form.enterKey("delete");
        }
      }}
    >
      <div className="relative shrink-0">
        <Header
          className="h-16 px-4"
          left={
            <HeaderBackButton onClick={() => router.push(`/stock/${code}`)} />
          }
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="caption-1-regular text-text-neutral-secondary">
            {stock.name}
          </span>
          <span className={cn("body-2-semibold", colorClass)}>
            {stock.price.toLocaleString()}원{" "}
            {formatSignedPercent(stock.changeRate)}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4">
        <StockTradePriceInput
          side={side}
          mode={form.priceMode}
          price={form.price}
          showAdjust={form.field === "price"}
          onModeChange={form.selectPriceMode}
          onFocus={() => form.selectField("price")}
          onChange={(value) => form.changeInput("price", value)}
          onAdjust={form.adjustPrice}
        />
        <StockTradeQuantityInput
          action={action}
          quantity={form.quantity}
          description={quantityDescription}
          onFocus={() => form.selectField("quantity")}
          onChange={(value) => form.changeInput("quantity", value)}
        />
        {form.inputMode === "orderbook" && (
          <StockTradeOrderBook
            quotes={demo.quotes}
            selectedPrice={form.price}
            currentPrice={stock.price}
            changeRate={stock.changeRate}
            onSelect={form.selectQuote}
          />
        )}
      </div>
      <div className="shrink-0 pt-3 pb-[max(24px,env(safe-area-inset-bottom))]">
        {form.inputMode === "number" && (
          <>
            <div
              className="grid grid-cols-4 gap-2 px-8 pt-2 pb-3"
              aria-label="주문 수량 비율 선택"
            >
              {[0.1, 0.25, 0.5, 1].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => form.selectRatio(ratio)}
                  className="body-2-semibold border-border-neutral-muted text-text-neutral-secondary bg-bg-layer-default/50 rounded-full border py-2 active:bg-gray-50"
                >
                  {ratio === 1 ? "최대" : `${ratio * 100}%`}
                </button>
              ))}
            </div>
            <NumberKeypad onKey={form.enterKey} className="px-7" />
          </>
        )}
        <div className="flex items-center gap-2 px-4 pt-6">
          <Button
            className="bg-bg-layer-default text-text-neutral-secondary h-14 w-20 shrink-0 gap-2 active:bg-gray-50"
            onClick={() =>
              form.setInputMode(
                form.inputMode === "number" ? "orderbook" : "number",
              )
            }
          >
            <span
              aria-hidden="true"
              className={
                form.inputMode === "number"
                  ? "flex w-3.5 flex-col gap-0.5"
                  : "grid w-3.5 grid-cols-3 gap-0.5"
              }
            >
              {Array.from(
                { length: form.inputMode === "number" ? 3 : 9 },
                (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "rounded-sm bg-current",
                      form.inputMode === "number" ? "h-1" : "size-0.75",
                      form.inputMode === "number" && i === 1 && "w-2",
                    )}
                  />
                ),
              )}
            </span>
            {form.inputMode === "number" ? "호가" : "숫자"}
          </Button>
          <Button
            className="bg-bg-accent active:bg-sky-blue-600 h-14"
            onClick={form.submit}
          >
            {action}하기
          </Button>
        </div>
      </div>
      <StockTradeResultSheet
        result={form.result}
        stockName={stock.name}
        side={side}
        onClose={() => form.setResult(null)}
        onViewHolding={() => router.replace(`/stock/${code}?tab=holding`)}
      />
    </div>
  );
}
