"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import CloseIcon from "@/assets/icons/fill/close.svg";
import DeleteIcon from "@/assets/icons/fill/delete.svg";
import MagnifierHappyIcon from "@/assets/icons/stockspoon/magnifier-happy.svg";
import MagnifierFlusteredIcon from "@/assets/icons/stockspoon/magnifier-flustered.svg";
import { SearchInput } from "@/features/stock/components/SearchInput";
import { SearchResultItem } from "@/features/stock/components/SearchResultItem";
import { SearchSuggestionItem } from "@/features/stock/components/SearchSuggestionItem";
import { useMarketPrices } from "@/features/stock/hooks/useMarketPrices";
import { useRecentSearches } from "@/features/stock/hooks/useRecentSearches";
import { useStockSearchQuery } from "@/features/stock/hooks/useStockSearchQuery";
import { toRankingStockFromSearchItem } from "@/features/stock/utils/toRankingStockFromSearchItem";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { HeaderBackButton } from "@/shared/components/Header";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

const SEARCH_DEBOUNCE_MS = 300;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function SearchContainer() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const debouncedKeyword = useDebouncedValue(keyword, SEARCH_DEBOUNCE_MS);
  const trimmedKeyword = debouncedKeyword.trim();
  const {
    stocks: searchItems,
    isPending,
    isError,
    refetch,
  } = useStockSearchQuery(trimmedKeyword);
  const { prices } = useMarketPrices(
    searchItems.map((item) => item.stock_code),
  );
  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useRecentSearches();

  const results = useMemo(
    () =>
      searchItems.map((item) =>
        toRankingStockFromSearchItem(item, prices[item.stock_code]),
      ),
    [searchItems, prices],
  );

  function handleSelectResult(stockCode: string) {
    addRecentSearch(trimmedKeyword);
    router.push(`/stock/${stockCode}`);
  }

  function handleKeywordChange(value: string) {
    setKeyword(value);
    setHasSubmitted(false);
  }

  function handleSelectRecent(term: string) {
    setKeyword(term);
    setHasSubmitted(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
    addRecentSearch(keyword.trim());
  }

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-2 px-5 py-3">
        <HeaderBackButton />
        <form className="flex-1" onSubmit={handleSubmit}>
          <SearchInput
            autoFocus
            enterKeyHint="search"
            right={
              keyword ? (
                <button
                  type="button"
                  aria-label="검색어 지우기"
                  onClick={() => handleKeywordChange("")}
                  className="flex items-center justify-center"
                >
                  <CloseIcon width={16} height={16} />
                </button>
              ) : undefined
            }
            placeholder="종목명 또는 종목코드 검색"
            value={keyword}
            onChange={handleKeywordChange}
          />
        </form>
      </div>

      {!trimmedKeyword && recentSearches.length > 0 && (
        <div className="flex flex-col gap-2 px-5 pt-1">
          <div className="flex items-center justify-between">
            <span className="caption-1-semibold text-text-neutral-secondary">
              최근 검색어
            </span>
            <button
              type="button"
              className="caption-1-regular text-text-neutral-tertiary flex items-center gap-0.5"
              onClick={clearRecentSearches}
            >
              <DeleteIcon width={14} height={14} />
              전체 삭제
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((item) => (
              <span
                key={item.search_id}
                className="bg-bg-layer-default flex items-center gap-1 rounded-full py-1.5 pr-2 pl-3"
              >
                <button
                  type="button"
                  className="body-2-medium text-text-neutral-secondary"
                  onClick={() => handleSelectRecent(item.keyword)}
                >
                  {item.keyword}
                </button>
                <button
                  type="button"
                  aria-label={`${item.keyword} 삭제`}
                  onClick={() => removeRecentSearch(item.search_id)}
                >
                  <CloseIcon
                    width={12}
                    height={12}
                    className="text-icon-neutral-secondary"
                  />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {!trimmedKeyword && (
        <div className="flex min-h-0 flex-1 flex-col items-center px-5 pt-32 max-sm:justify-center max-sm:pt-0">
          <EmptyState
            icon={MagnifierHappyIcon}
            iconSize={80}
            message="어떤 종목이 궁금하신가요?"
            description="종목명 또는 종목코드로 검색해보세요"
          />
        </div>
      )}

      {trimmedKeyword && results.length > 0 && !hasSubmitted && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 pt-2 pb-10">
          {results.map((stock) => (
            <SearchSuggestionItem
              key={stock.stockCode}
              stockCode={stock.stockCode}
              name={stock.name}
              query={trimmedKeyword}
              matchedBy={
                normalize(stock.name).includes(normalize(trimmedKeyword))
                  ? "name"
                  : "code"
              }
              onClick={() => handleSelectResult(stock.stockCode)}
            />
          ))}
        </div>
      )}

      {trimmedKeyword && hasSubmitted && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-4 pb-10">
          {isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : isPending ? null : results.length === 0 ? (
            <EmptyState
              icon={MagnifierFlusteredIcon}
              iconSize={70}
              message="검색 결과가 없어요"
              description="종목명 또는 종목코드를 다시 확인해주세요"
              actionLabel="실시간 랭킹 보러 가기"
              onAction={() => router.push("/discover")}
            />
          ) : (
            <>
              <span className="body-2-semibold text-text-neutral-secondary mb-2">
                {results.length}개의 결과
              </span>
              <div className="flex flex-col gap-2">
                {results.map((stock) => (
                  <SearchResultItem
                    key={stock.stockCode}
                    {...stock}
                    onClick={() => handleSelectResult(stock.stockCode)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
