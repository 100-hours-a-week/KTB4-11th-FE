"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/shared/components/Header";
import { StockTickerBar } from "@/shared/components/StockTickerBar";
import { useKospiIndexQuery } from "@/features/stock/hooks/useKospiIndexQuery";
import SearchIcon from "@/assets/icons/fill/search.svg";
import ProfileIcon from "@/assets/icons/fill/profile.svg";
import { useRouter } from "next/navigation";
import { AccountSelector } from "@/features/account/components/AccountSelector";
import { AccountBalanceCard } from "@/features/account/components/AccountBalanceCard";
import { HoldingStockList } from "@/features/account/components/HoldingStockList";
import { useAccountDetailQuery } from "@/features/account/hooks/useAccountDetailQuery";
import { useSelectedAccountId } from "@/features/account/hooks/useSelectedAccountId";
import { useHoldingsQuery } from "@/features/account/hooks/useHoldingsQuery";
import { toHoldingStock } from "@/features/account/utils/toHoldingStock";
import { RecentTradeSection } from "@/features/stock/components/trade/RecentTradeSection";
import { useOrdersQuery } from "@/features/stock/hooks/useOrdersQuery";
import { toStockTrade } from "@/features/stock/utils/toStockTrade";
import { MenuRow } from "@/shared/components/MenuRow";
import { trackEvent } from "@/shared/utils/analytics";
import {
  HOME_HOLDINGS_PARAMS,
  HOME_ORDERS_PARAMS,
} from "@/features/home/constants/homeQueries";

export function HomeAccountSection() {
  const router = useRouter();
  const accountId = useSelectedAccountId();
  const { data: account } = useAccountDetailQuery(accountId);
  return (
    <>
      <AccountSelector />
      <div className="flex flex-col gap-2">
        <AccountBalanceCard
          availableCash={account?.available_cash ?? 0}
          valuation={account?.holdings_market_value ?? 0}
        />
        <MenuRow label="주문내역" onClick={() => router.push("/trades")} />
      </div>
    </>
  );
}

export function HomeHoldingsSection() {
  const accountId = useSelectedAccountId();
  const { data, isError, isPending, refetch } = useHoldingsQuery(
    accountId,
    HOME_HOLDINGS_PARAMS,
  );
  const holdings = data?.holdings ?? [];
  useEffect(() => {
    if (isError)
      trackEvent("error_view", {
        screen: "home_holdings",
        api_name: "holdings",
      });
  }, [isError]);
  useEffect(() => {
    if (!isError && data && holdings.length === 0)
      trackEvent("empty_state_view", {
        screen: "home_holdings",
        empty_type: "no_holdings",
      });
  }, [isError, data, holdings.length]);
  return (
    <HoldingStockList
      stocks={holdings.map(toHoldingStock)}
      isPending={isPending}
      isError={isError}
      onRetry={() => {
        trackEvent("retry_click", {
          screen: "home_holdings",
          api_name: "holdings",
        });
        refetch();
      }}
    />
  );
}

export function HomeTradesSection() {
  const accountId = useSelectedAccountId();
  const { data, isError, isPending, refetch } = useOrdersQuery(
    accountId,
    HOME_ORDERS_PARAMS,
  );
  const trades = (data?.orders ?? []).map(toStockTrade);
  useEffect(() => {
    if (isError)
      trackEvent("error_view", { screen: "home_trades", api_name: "orders" });
  }, [isError]);
  useEffect(() => {
    if (!isError && data && trades.length === 0)
      trackEvent("empty_state_view", {
        screen: "home_trades",
        empty_type: "no_trades",
      });
  }, [isError, data, trades.length]);
  return (
    <RecentTradeSection
      trades={trades}
      isPending={isPending}
      isError={isError}
      onRetry={() => {
        trackEvent("retry_click", {
          screen: "home_trades",
          api_name: "orders",
        });
        refetch();
      }}
    />
  );
}

// 검색 버튼과 코스피 갱신을 담당하는 클라이언트 영역
export function HomeHeader() {
  const router = useRouter();
  const { data: kospi } = useKospiIndexQuery();
  return (
    <>
      <Header
        className="px-5"
        right={
          <>
            <button type="button" onClick={() => router.push("/search")}>
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
        kospi={kospi && { value: kospi.value, changeRate: kospi.rate }}
      />
    </>
  );
}
