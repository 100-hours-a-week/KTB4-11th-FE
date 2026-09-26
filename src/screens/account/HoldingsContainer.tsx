"use client";

import { useMemo, useState } from "react";
import { HoldingCategoryChips } from "@/features/account/components/HoldingCategoryChips";
import { HoldingStockItem } from "@/features/account/components/HoldingStockItem";
import { HoldingsSortDropdown } from "@/features/account/components/HoldingsSortDropdown";
import { useHoldingsQuery } from "@/features/account/hooks/useHoldingsQuery";
import { useSelectedAccountId } from "@/features/account/hooks/useSelectedAccountId";
import type { HoldingsSort } from "@/features/account/types/holdingStock";
import { toHoldingStock } from "@/features/account/utils/toHoldingStock";
import BasketFlusteredIcon from "@/assets/icons/stockspoon/basket-flustered.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { Header, HeaderBackButton } from "@/shared/components/Header";

const ALL_CATEGORY = "전체";

export function HoldingsContainer() {
  const accountId = useSelectedAccountId();
  const [sort, setSort] = useState<HoldingsSort>("latest_purchase");
  const [category, setCategory] = useState(ALL_CATEGORY);

  const {
    data: holdingsData,
    isError,
    refetch,
  } = useHoldingsQuery(accountId, { sort, order: "desc" });

  const stocks = useMemo(
    () => (holdingsData?.holdings ?? []).map(toHoldingStock),
    [holdingsData],
  );

  const categories = useMemo(
    () => Array.from(new Set(stocks.map((stock) => stock.category))),
    [stocks],
  );

  const filteredStocks =
    category === ALL_CATEGORY
      ? stocks
      : stocks.filter((stock) => stock.category === category);

  return (
    <div className="pt-safe-top flex h-full flex-col">
      <Header
        title="보유 주식"
        className="px-5 py-3"
        left={<HeaderBackButton />}
      />

      <div className="flex flex-1 flex-col gap-3 px-5 pt-2 pb-8">
        <HoldingCategoryChips
          categories={categories}
          value={category}
          onChange={setCategory}
        />

        {!isError && filteredStocks.length > 0 && (
          <div className="flex justify-end">
            <HoldingsSortDropdown value={sort} onChange={setSort} />
          </div>
        )}

        {isError ? (
          <div className="bg-bg-layer-default rounded-2xl">
            <ErrorState onRetry={() => refetch()} />
          </div>
        ) : filteredStocks.length === 0 ? (
          <div className="bg-bg-layer-default flex flex-1 flex-col items-center rounded-2xl pt-32">
            <EmptyState
              icon={BasketFlusteredIcon}
              message={
                category === ALL_CATEGORY
                  ? "아직 보유한 종목이 없어요"
                  : `${category} 종목이 없어요`
              }
              description={
                category === ALL_CATEGORY
                  ? "AI 매매가 체결되면 보유 종목이 여기 표시돼요"
                  : undefined
              }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredStocks.map((stock) => (
              <HoldingStockItem key={stock.id} {...stock} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
