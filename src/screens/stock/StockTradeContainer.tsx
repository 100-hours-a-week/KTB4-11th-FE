"use client";

import { formatKoreanWon } from "@/shared/utils/formatKoreanWon";
import { cn } from "@/shared/utils/cn";
import { useRouter } from "next/navigation";
import { useAccountDetailQuery } from "@/features/account/hooks/useAccountDetailQuery";
import { useSelectedAccountId } from "@/features/account/hooks/useSelectedAccountId";
import { NumberKeypad } from "@/features/stock/components/trade/NumberKeypad";
import { StockTradeOrderBook } from "@/features/stock/components/trade/StockTradeOrderBook";
import { StockTradePriceInput } from "@/features/stock/components/trade/StockTradePriceInput";
import { StockTradeQuantityInput } from "@/features/stock/components/trade/StockTradeQuantityInput";
import { StockTradeResultSheet } from "@/features/stock/components/trade/StockTradeResultSheet";
import { LegacyAccountOrderModal } from "@/features/stock/components/trade/LegacyAccountOrderModal";
import { useMarketOrderBook } from "@/features/stock/hooks/useMarketOrderBook";
import { useMarketPrice } from "@/features/stock/hooks/useMarketPrice";
import { useStockHoldingQuery } from "@/features/stock/hooks/useStockHoldingQuery";
import { useStockInfoQuery } from "@/features/stock/hooks/useStockInfoQuery";
import { useStockTradeForm } from "@/features/stock/hooks/useStockTradeForm";
import type { StockTradeSide } from "@/features/stock/types/stockTrade";
import { isRegularMarketHours } from "@/features/stock/utils/marketHours";
import { toOrderBook } from "@/features/stock/utils/toOrderBook";
import { AnimatedPriceText } from "@/shared/components/AnimatedPriceText";
import { Button } from "@/shared/components/Button";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { trackEvent } from "@/shared/utils/analytics";
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

  const { data: stockInfo } = useStockInfoQuery(code);
  const { price: marketPrice, isPending: isMarketPricePending } =
    useMarketPrice(code);
  const stockName = stockInfo?.stock_name ?? code;
  const price = marketPrice?.price ?? 0;
  const changeRate = marketPrice?.rate ?? 0;

  const accountId = useSelectedAccountId();
  const { data: accountDetail } = useAccountDetailQuery(accountId);
  const { data: holdingData } = useStockHoldingQuery(accountId, code);
  const availableCash = accountDetail?.available_cash ?? 0;
  const availableQuantity = holdingData?.quantity ?? 0;

  const isRegularMarket = isRegularMarketHours();
  const form = useStockTradeForm(
    accountId,
    code,
    stockName,
    side,
    side === "buy" ? (marketPrice?.price ?? 0) : price,
    marketPrice?.upper_limit_price,
    marketPrice?.lower_limit_price,
    availableCash,
    availableQuantity,
    isRegularMarket,
  );

  const { orderBook: marketOrderBook, isLoading: isOrderBookLoading } =
    useMarketOrderBook(form.inputMode === "orderbook" ? code : undefined);
  const orderBook =
    marketOrderBook &&
    toOrderBook(
      marketOrderBook,
      price,
      changeRate,
      isRegularMarket,
      marketPrice,
    );
  const action = side === "buy" ? "구매" : "판매";
  const { colorClass } = getReturnRateInfo(changeRate);
  const availability =
    side === "buy"
      ? `구매가능 ${availableCash.toLocaleString()}원${form.priceMode === "market" ? "" : ` · 최대 ${form.maxQuantity.toLocaleString()}주`}`
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
          left={<HeaderBackButton fallbackHref={`/stock/${code}`} />}
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="caption-1-regular text-text-neutral-secondary">
            {stockName}
          </span>
          {!isMarketPricePending && (
            <AnimatedPriceText
              className={cn("body-2-semibold", colorClass)}
              text={`${price.toLocaleString()}원 ${formatSignedPercent(changeRate)}`}
            />
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4">
        <StockTradePriceInput
          side={side}
          mode={form.priceMode}
          price={form.price}
          feedbackRef={form.priceFeedback.feedbackRef}
          errorMessage={form.priceFeedback.errorMessage}
          isErrorFading={form.priceFeedback.isErrorFading}
          showAdjust={form.field === "price"}
          isRegularMarket={isRegularMarket}
          onModeChange={form.selectPriceMode}
          onFocus={() => form.selectField("price")}
          onChange={(value) => form.changeInput("price", value)}
          onAdjust={form.adjustPrice}
        />
        <StockTradeQuantityInput
          action={action}
          quantity={form.quantity}
          description={quantityDescription}
          feedbackRef={form.quantityFeedback.feedbackRef}
          errorMessage={form.quantityFeedback.errorMessage}
          isErrorFading={form.quantityFeedback.isErrorFading}
          onFocus={() => form.selectField("quantity")}
          onChange={(value) => form.changeInput("quantity", value)}
        />
        {form.inputMode === "orderbook" &&
          (orderBook ? (
            <StockTradeOrderBook
              orderBook={orderBook}
              selectedPrice={form.price}
              onSelect={(quotePrice) => {
                trackEvent("trade_orderbook_select", {
                  stock_code: code,
                  side,
                  price: quotePrice,
                });
                form.selectQuote(quotePrice);
              }}
            />
          ) : (
            <div className="flex min-h-32 flex-1 items-center justify-center">
              <span className="caption-1-regular text-text-neutral-tertiary">
                {isOrderBookLoading
                  ? "호가를 불러오는 중이에요"
                  : "장이 열리면 호가를 확인할 수 있어요"}
              </span>
            </div>
          ))}
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
            onClick={() => {
              const nextMode =
                form.inputMode === "number" ? "orderbook" : "number";
              trackEvent("trade_input_mode_change", {
                stock_code: code,
                mode: nextMode,
              });
              form.setInputMode(nextMode);
            }}
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
        result={form.result?.type === "legacy-account" ? null : form.result}
        stockName={stockName}
        side={side}
        onClose={() => form.setResult(null)}
        onViewHolding={() => router.replace(`/stock/${code}?tab=holding`)}
      />
      <LegacyAccountOrderModal
        open={form.result?.type === "legacy-account"}
        onOpenChange={(open) => {
          if (!open) form.setResult(null);
        }}
        onCreateAccount={() => {
          form.setResult(null);
          router.push("/account/create");
        }}
      />
    </div>
  );
}
