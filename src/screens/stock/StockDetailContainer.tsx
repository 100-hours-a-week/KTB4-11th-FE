"use client";

import { cn } from "@/shared/utils/cn";
import {
  DEMO_STOCK_INFO,
  DEMO_HOLDING_STOCK_CODES,
  DEMO_ORDER_BOOK,
  DEMO_HOLDING,
  DEMO_PENDING_ORDERS,
  DEMO_ORDER_HISTORY,
} from "@/features/stock/mocks/stockDetail";
import { useState } from "react";
import { useRouter } from "next/navigation";
import HeartFilledIcon from "@/assets/icons/nav/filled/heart.svg";
import HeartOutlineIcon from "@/assets/icons/nav/outline/heart.svg";
import { StockChartPlaceholder } from "@/features/stock/components/StockChartPlaceholder";
import { StockDetailTabs } from "@/features/stock/components/StockDetailTabs";
import { StockHoldingSummary } from "@/features/stock/components/StockHoldingSummary";
import { StockOrderBook } from "@/features/stock/components/StockOrderBook";
import { StockOrderBookWaitingBar } from "@/features/stock/components/StockOrderBookWaitingBar";
import { StockOrderHistoryList } from "@/features/stock/components/StockOrderHistoryList";
import { StockPendingOrderList } from "@/features/stock/components/StockPendingOrderList";
import { StockPriceSummary } from "@/features/stock/components/StockPriceSummary";
import { StockTradeButtons } from "@/features/stock/components/StockTradeButtons";
import {
  STOCK_DETAIL_TABS_WITH_HOLDING,
  STOCK_DETAIL_TABS_WITHOUT_HOLDING,
  type StockDetailTab,
} from "@/features/stock/types/stockDetail";
import { Header, HeaderBackButton } from "@/shared/components/Header";

interface StockDetailContainerProps {
  code: string;
  initialTab?: StockDetailTab;
}

export function StockDetailContainer({
  code,
  initialTab = "차트",
}: StockDetailContainerProps) {
  const router = useRouter();
  const stockInfo = DEMO_STOCK_INFO[code] ?? DEMO_STOCK_INFO["035420"];
  const hasHolding = DEMO_HOLDING_STOCK_CODES.has(stockInfo.stockCode);

  const [isFavorite, setIsFavorite] = useState(stockInfo.isFavorite);
  const tabs = hasHolding
    ? STOCK_DETAIL_TABS_WITH_HOLDING
    : STOCK_DETAIL_TABS_WITHOUT_HOLDING;
  const [tab, setTab] = useState<StockDetailTab>(
    initialTab === "내 주식" && !hasHolding ? "차트" : initialTab,
  );

  const HeartIcon = isFavorite ? HeartFilledIcon : HeartOutlineIcon;

  return (
    <div className="bg-page-gradient pt-screen-top flex h-full flex-col">
      <Header
        className="px-5 py-3"
        left={<HeaderBackButton />}
        right={
          <button
            type="button"
            onClick={() => setIsFavorite((prev) => !prev)}
            aria-label={isFavorite ? "관심 종목 해제" : "관심 종목 등록"}
          >
            <HeartIcon
              width={24}
              height={24}
              className={
                isFavorite ? "text-icon-accent" : "text-icon-neutral-secondary"
              }
            />
          </button>
        }
      />

      <StockPriceSummary
        name={stockInfo.name}
        price={stockInfo.price}
        changeAmount={stockInfo.changeAmount}
        changeRate={stockInfo.changeRate}
      />

      <div className="mt-4">
        <StockDetailTabs tabs={tabs} value={tab} onChange={setTab} />
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto",
          tab !== "호가" && "pb-4",
        )}
      >
        {tab === "차트" && <StockChartPlaceholder />}
        {tab === "호가" && <StockOrderBook orderBook={DEMO_ORDER_BOOK} />}
        {tab === "내 주식" && hasHolding && (
          <div className="flex flex-col gap-4 px-5 pt-4">
            <StockHoldingSummary holding={DEMO_HOLDING} />
            <StockPendingOrderList orders={DEMO_PENDING_ORDERS} />
            <StockOrderHistoryList items={DEMO_ORDER_HISTORY} />
          </div>
        )}
      </div>

      <div className="relative">
        {tab !== "호가" && (
          <div
            className="pointer-events-none absolute inset-x-0 -top-9 h-9"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, var(--color-bg-layer-basement) 100%)",
            }}
          />
        )}
        {tab === "호가" && (
          <StockOrderBookWaitingBar orderBook={DEMO_ORDER_BOOK} />
        )}
        <StockTradeButtons
          showSell={hasHolding}
          onBuyClick={() => router.push(`/stock/${code}/buy`)}
          onSellClick={() => router.push(`/stock/${code}/sell`)}
        />
      </div>
    </div>
  );
}
