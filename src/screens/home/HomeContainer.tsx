"use client";

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
import SearchIcon from "@/assets/icons/fill/search.svg";
import ProfileIcon from "@/assets/icons/fill/profile.svg";

export function HomeContainer() {
  const accountId = useSelectedAccountId();

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

  return (
    <div className="bg-page-gradient pt-safe-top flex h-full flex-col">
      <Header
        className="px-5"
        right={
          <>
            <SearchIcon
              width={24}
              height={24}
              className="text-icon-neutral-primary"
            />
            <ProfileIcon
              width={24}
              height={24}
              className="text-icon-neutral-primary"
            />
          </>
        }
      />
      <StockTickerBar title="스톡스푼" />
      <div className="flex flex-col gap-1 px-5 pb-24">
        <AccountSelector />
        <div className="flex flex-col gap-2">
          <AccountBalanceCard
            cashBalance={account?.cash_balance ?? 0}
            valuation={account?.holdings_market_value ?? 0}
          />
          <MenuRow label="주문내역" />
        </div>
        <div className="mt-4">
          <HoldingStockList
            stocks={holdings.map(toHoldingStock)}
            isError={isHoldingsError}
            onRetry={() => refetchHoldings()}
          />
        </div>
        <div className="mt-4">
          <RecentAiTradeSection
            trades={[
              {
                stockName: "SK하이닉스",
                tradeType: "매도",
                tradeDate: "2026.09.03 14:20",
                quantity: 2,
                price: 196_000,
                reasoning:
                  "목표 수익률에 도달하고 상승 흐름이 약해져 매도했어요.",
                realizedProfit: 18_400,
                profitRate: 4.9,
              },
              {
                stockName: "삼성전자",
                tradeType: "매수",
                tradeDate: "2026.08.27 10:14",
                quantity: 3,
                price: 72_400,
                reasoning: "추세 상승과 거래량 증가를 확인해 매수했어요.",
                realizedProfit: 0,
                profitRate: 0,
              },
              {
                stockName: "카카오",
                tradeType: "매수",
                tradeDate: "2026.08.26 09:38",
                quantity: 15,
                price: 43_000,
                reasoning: "업종 비중을 나누기 위해 플랫폼 종목을 담았어요.",
                realizedProfit: 0,
                profitRate: 0,
              },
            ]}
          />
        </div>
      </div>
      <BottomTabBar />
    </div>
  );
}
