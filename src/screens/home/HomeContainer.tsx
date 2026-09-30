"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { BottomTabBar } from "@/shared/components/BottomTabBar";
import { Header } from "@/shared/components/Header";
import { MenuRow } from "@/shared/components/MenuRow";
import { StockTickerBar } from "@/shared/components/StockTickerBar";
import { AccountBalanceCard } from "@/features/account/components/AccountBalanceCard";
import { AccountSelector } from "@/features/account/components/AccountSelector";
import { HoldingStockList } from "@/features/account/components/HoldingStockList";
import { useAccountDetailQuery } from "@/features/account/hooks/useAccountDetailQuery";
import { useHoldingsQuery } from "@/features/account/hooks/useHoldingsQuery";
import { useSelectedAccountId } from "@/features/account/hooks/useSelectedAccountId";
import { toHoldingStock } from "@/features/account/utils/toHoldingStock";
import { RecentAiTradeSection } from "@/features/ai/components/RecentAiTradeSection";
import { useOrdersQuery } from "@/features/ai/hooks/useOrdersQuery";
import { toAiTrade } from "@/features/ai/utils/toAiTrade";
import { useKospiIndexQuery } from "@/features/stock/hooks/useKospiIndexQuery";
import SearchIcon from "@/assets/icons/fill/search.svg";
import ProfileIcon from "@/assets/icons/fill/profile.svg";
import { trackEvent } from "@/shared/utils/analytics";

export function HomeContainer() {
  const router = useRouter();
  const accountId = useSelectedAccountId();

  const { data: kospi } = useKospiIndexQuery();
  const { data: account } = useAccountDetailQuery(accountId);
  const {
    data: holdingsData,
    isError: isHoldingsError,
    refetch: refetchHoldings,
  } = useHoldingsQuery(accountId, {
    sort: "latest_purchase",
    order: "desc",
    limit: 3,
  });
  const holdings = holdingsData?.holdings ?? [];

  const {
    data: ordersResponse,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useOrdersQuery(accountId);
  const trades = (ordersResponse?.orders ?? []).map(toAiTrade);

  useEffect(() => {
    if (isHoldingsError) {
      trackEvent("error_view", {
        screen: "home_holdings",
        api_name: "holdings",
      });
    }
  }, [isHoldingsError]);

  useEffect(() => {
    if (!isHoldingsError && holdingsData && holdings.length === 0) {
      trackEvent("empty_state_view", {
        screen: "home_holdings",
        empty_type: "no_holdings",
      });
    }
  }, [isHoldingsError, holdingsData, holdings.length]);

  useEffect(() => {
    if (isOrdersError) {
      trackEvent("error_view", {
        screen: "home_ai_trades",
        api_name: "orders",
      });
    }
  }, [isOrdersError]);

  useEffect(() => {
    if (!isOrdersError && ordersResponse && trades.length === 0) {
      trackEvent("empty_state_view", {
        screen: "home_ai_trades",
        empty_type: "no_trades",
      });
    }
  }, [isOrdersError, ordersResponse, trades.length]);

  return (
    <div className="bg-page-gradient pt-safe-top flex h-full flex-col">
      <Header
        className="px-5"
        right={
          <>
            <button
              type="button"
              onClick={() => {
                trackEvent("unsupported_feature_click", {
                  feature_name: "search",
                });
                toast.info("검색 기능은 v2에서 이용할 수 있어요");
              }}
            >
              <SearchIcon
                width={24}
                height={24}
                className="text-icon-neutral-primary"
              />
            </button>
            <Link href="/mypage">
              <ProfileIcon
                width={24}
                height={24}
                className="text-icon-neutral-primary"
              />
            </Link>
          </>
        }
      />
      <StockTickerBar
        title="스톡스푼"
        kospi={kospi && { value: kospi.value, changeRate: kospi.changeRate }}
      />
      <div className="flex flex-col gap-1 px-5 pb-24">
        <AccountSelector />
        <div className="flex flex-col gap-2">
          <AccountBalanceCard
            cashBalance={account?.cash_balance ?? 0}
            valuation={account?.holdings_market_value ?? 0}
          />
          <MenuRow label="주문내역" onClick={() => router.push("/ai/trades")} />
        </div>
        <div className="mt-4">
          <HoldingStockList
            stocks={holdings.map(toHoldingStock)}
            isError={isHoldingsError}
            onRetry={() => {
              trackEvent("retry_click", {
                screen: "home_holdings",
                api_name: "holdings",
              });
              refetchHoldings();
            }}
          />
        </div>
        <div className="mt-4">
          <RecentAiTradeSection
            trades={trades}
            isError={isOrdersError}
            onRetry={() => {
              trackEvent("retry_click", {
                screen: "home_ai_trades",
                api_name: "orders",
              });
              refetchOrders();
            }}
          />
        </div>
      </div>
      <BottomTabBar />
    </div>
  );
}
