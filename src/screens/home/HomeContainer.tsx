import { Header } from "@/shared/components/Header";
import { StockTickerBar } from "@/shared/components/StockTickerBar";
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
    </div>
  );
}
