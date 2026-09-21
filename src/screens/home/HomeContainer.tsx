import { Header } from "@/shared/components/Header";
import { MenuRow } from "@/shared/components/MenuRow";
import { StockTickerBar } from "@/shared/components/StockTickerBar";
import { AccountBalanceCard } from "@/features/account/components/AccountBalanceCard";
import { AccountSelector } from "@/screens/home/AccountSelector";
import SearchIcon from "@/assets/icons/fill/search.svg";
import ProfileIcon from "@/assets/icons/fill/profile.svg";

export function HomeContainer() {
  return (
    <div className="flex h-full flex-col">
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
      <AccountSelector />
      <div className="flex flex-col gap-2 px-6">
        <AccountBalanceCard cashBalance={1_240_000} valuation={12_480_000} />
        <div className="bg-bg-layer-default rounded-2xl px-4">
          <MenuRow label="주문내역" />
        </div>
      </div>
    </div>
  );
}
