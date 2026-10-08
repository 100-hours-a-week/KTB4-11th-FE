"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { RankingList } from "@/features/stock/components/RankingList";
import { RankingTypeTabs } from "@/features/stock/components/RankingTypeTabs";
import { SearchInput } from "@/features/stock/components/SearchInput";
import type { RankingStock, RankingType } from "@/features/stock/types/ranking";
import { useKospiIndexQuery } from "@/features/stock/hooks/useKospiIndexQuery";
import SearchIcon from "@/assets/icons/fill/search.svg";
import ProfileIcon from "@/assets/icons/fill/profile.svg";
import { BottomTabBar } from "@/shared/components/BottomTabBar";
import { Header } from "@/shared/components/Header";
import { StockTickerBar } from "@/shared/components/StockTickerBar";
import { trackEvent } from "@/shared/utils/analytics";

// 실제 랭킹 API 연동 시 제거
const DEMO_STOCKS: Omit<RankingStock, "rank" | "isFavorite">[] = [
  {
    stockCode: "005930",
    name: "삼성전자",
    sector: "반도체",
    price: 74_100,
    changeRate: 1.5,
  },
  {
    stockCode: "000660",
    name: "SK하이닉스",
    sector: "반도체",
    price: 183_000,
    changeRate: 2.6,
  },
  {
    stockCode: "196170",
    name: "알테오젠",
    sector: "바이오",
    price: 312_000,
    changeRate: 7.8,
  },
  {
    stockCode: "035720",
    name: "카카오",
    sector: "플랫폼",
    price: 43_000,
    changeRate: -1.5,
  },
  {
    stockCode: "267260",
    name: "두산에너빌리티",
    sector: "기계",
    price: 51_200,
    changeRate: 3.3,
  },
  {
    stockCode: "035420",
    name: "NAVER",
    sector: "플랫폼",
    price: 221_500,
    changeRate: -0.8,
  },
  {
    stockCode: "373220",
    name: "LG에너지솔루션",
    sector: "2차전지",
    price: 412_000,
    changeRate: 0.9,
  },
  {
    stockCode: "005380",
    name: "현대차",
    sector: "자동차",
    price: 245_000,
    changeRate: -2.1,
  },
  {
    stockCode: "051910",
    name: "LG화학",
    sector: "화학",
    price: 398_500,
    changeRate: 1.1,
  },
  {
    stockCode: "006400",
    name: "삼성SDI",
    sector: "2차전지",
    price: 356_000,
    changeRate: -0.4,
  },
];

function buildDemoRanking(count: number): RankingStock[] {
  return Array.from({ length: count }, (_, index) => {
    const base = DEMO_STOCKS[index % DEMO_STOCKS.length];
    return {
      ...base,
      rank: index + 1,
      stockCode: `${base.stockCode}-${index}`,
      isFavorite: false,
    };
  });
}

const PAGE_SIZE = 10;
const TOTAL_COUNT = 100;

export function DiscoverContainer() {
  const { data: kospi } = useKospiIndexQuery();
  const [rankingType, setRankingType] = useState<RankingType>("거래대금");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const ranking = buildDemoRanking(TOTAL_COUNT).map((stock) => ({
    ...stock,
    isFavorite: favorites.has(stock.stockCode),
  }));
  const visibleRanking = ranking.slice(0, visibleCount);

  function handleToggleFavorite(stockCode: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(stockCode)) {
        next.delete(stockCode);
      } else {
        next.add(stockCode);
      }
      return next;
    });
  }

  return (
    <div className="bg-page-gradient pt-screen-top flex h-full flex-col">
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
        title="발견"
        logo={false}
        kospi={kospi && { value: kospi.value, changeRate: kospi.changeRate }}
      />
      <div className="flex flex-col gap-4 px-5">
        <SearchInput placeholder="종목 검색" />
        <span className="heading-2-semibold">실시간 차트</span>
        <RankingTypeTabs value={rankingType} onChange={setRankingType} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-28">
        <RankingList
          items={visibleRanking}
          hasMore={visibleCount < ranking.length}
          onLoadMore={() =>
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, TOTAL_COUNT))
          }
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
      <BottomTabBar />
    </div>
  );
}
