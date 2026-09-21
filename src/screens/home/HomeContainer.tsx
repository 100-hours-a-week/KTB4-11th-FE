import { Header } from "@/shared/components/Header";
import { MenuRow } from "@/shared/components/MenuRow";
import { StockTickerBar } from "@/shared/components/StockTickerBar";
import { AccountBalanceCard } from "@/features/account/components/AccountBalanceCard";
import { HoldingStockList } from "@/features/account/components/HoldingStockList";
import { AccountSelector } from "@/screens/home/AccountSelector";
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
              className="text-icon-neutral-secondary"
            />
            <ProfileIcon
              width={24}
              height={24}
              className="text-icon-neutral-secondary"
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
      </div>
    </div>
  );
}
