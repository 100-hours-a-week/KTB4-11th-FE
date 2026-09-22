import { Header } from "@/shared/components/Header";
import { MenuRow } from "@/shared/components/MenuRow";
import { StockTickerBar } from "@/shared/components/StockTickerBar";
import { AccountBalanceCard } from "@/features/account/components/AccountBalanceCard";
import { AccountSelector } from "@/features/account/components/AccountSelector";
import { HoldingStockList } from "@/features/account/components/HoldingStockList";
import { RecentAiTradeSection } from "@/features/ai/components/RecentAiTradeSection";
import SearchIcon from "@/assets/icons/fill/search.svg";
import ProfileIcon from "@/assets/icons/fill/profile.svg";

export function HomeContainer() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,var(--color-gray-25)_0%,var(--color-gray-50)_100%)]">
      <Header
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
      <div className="flex flex-col gap-1 px-5">
        <AccountSelector />
        <div className="flex flex-col gap-2">
          <AccountBalanceCard cashBalance={1_240_000} valuation={12_480_000} />
          <div className="bg-bg-layer-default rounded-2xl px-4">
            <MenuRow label="주문내역" />
          </div>
        </div>
        <div className="mt-4">
          <HoldingStockList
            stocks={[
              {
                id: "1",
                name: "삼성전자",
                category: "반도체",
                quantity: 12,
                avgPrice: 71_200,
                value: 889_200,
                changeRate: 4.0,
              },
              {
                id: "2",
                name: "카카오",
                category: "플랫폼",
                quantity: 30,
                avgPrice: 41_500,
                value: 1_290_000,
                changeRate: 3.6,
              },
              {
                id: "3",
                name: "NAVER",
                category: "플랫폼",
                quantity: 4,
                avgPrice: 223_000,
                value: 886_000,
                changeRate: -0.8,
              },
            ]}
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
    </div>
  );
}
