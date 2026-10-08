import { http, HttpResponse, type HttpHandler } from "msw";
import type { KospiIndexResponse } from "@/features/stock/types/kospiIndex";
import type {
  RankingApiItem,
  RankingApiResponse,
  RankingApiType,
} from "@/features/stock/types/ranking";
import type { WatchlistResponse } from "@/features/stock/types/watchlist";

const BASE_VALUE = 2817.42;
const BASE_CHANGE = -12.5;

interface StockPoolEntry {
  stockName: string;
  sectorName: string;
  logoUrl: string | null;
  price: number;
  changeRate: number;
  priceBasis: string;
}

const STOCK_POOL: StockPoolEntry[] = [
  {
    stockName: "삼성전자",
    sectorName: "반도체",
    logoUrl: null,
    price: 74_100,
    changeRate: 1.5,
    priceBasis: "CURRENT",
  },
  {
    stockName: "SK하이닉스",
    sectorName: "반도체",
    logoUrl: null,
    price: 183_000,
    changeRate: 2.6,
    priceBasis: "CURRENT",
  },
  {
    stockName: "알테오젠",
    sectorName: "바이오",
    logoUrl: null,
    price: 312_000,
    changeRate: 7.8,
    priceBasis: "CURRENT",
  },
  {
    stockName: "카카오",
    sectorName: "플랫폼",
    logoUrl: null,
    price: 43_000,
    changeRate: -1.5,
    priceBasis: "CURRENT",
  },
  {
    stockName: "두산에너빌리티",
    sectorName: "기계",
    logoUrl: null,
    price: 51_200,
    changeRate: 3.3,
    priceBasis: "CURRENT",
  },
  {
    stockName: "NAVER",
    sectorName: "플랫폼",
    logoUrl: null,
    price: 221_500,
    changeRate: -0.8,
    priceBasis: "CURRENT",
  },
  {
    stockName: "LG에너지솔루션",
    sectorName: "2차전지",
    logoUrl: null,
    price: 412_000,
    changeRate: 0.9,
    priceBasis: "CURRENT",
  },
  {
    stockName: "현대차",
    sectorName: "자동차",
    logoUrl: null,
    price: 245_000,
    changeRate: -2.1,
    priceBasis: "CURRENT",
  },
  {
    stockName: "LG화학",
    sectorName: "화학",
    logoUrl: null,
    price: 398_500,
    changeRate: 1.1,
    priceBasis: "CURRENT",
  },
  {
    stockName: "삼성SDI",
    sectorName: "2차전지",
    logoUrl: null,
    price: 356_000,
    changeRate: -0.4,
    priceBasis: "CURRENT",
  },
];

// 인기 종목은 20개, 그 외는 100개까지 제공
const MAX_BY_TYPE: Record<RankingApiType, number> = {
  TRADING_VALUE: 100,
  VOLUME: 100,
  RISE: 100,
  FALL: 100,
  POPULAR: 20,
};

const favoriteStockCodes = new Set<string>();

function buildRankingItems(type: RankingApiType): RankingApiItem[] {
  const total = MAX_BY_TYPE[type];

  return Array.from({ length: total }, (_, index) => {
    const base = STOCK_POOL[index % STOCK_POOL.length];
    const stockCode = `${type}-${index}`;

    return {
      ...base,
      rank: index + 1,
      stockCode,
      isFavorite: favoriteStockCodes.has(stockCode),
      priceUpdatedAt: new Date().toISOString(),
    };
  });
}

export const stockHandlers: HttpHandler[] = [
  http.get("*/api/v1/market/indices/kospi", async () => {
    const fluctuation = (Math.random() - 0.5) * 10;
    const value = BASE_VALUE + fluctuation;
    const change = BASE_CHANGE + fluctuation;
    const changeRate = (change / (value - change)) * 100;

    return HttpResponse.json<KospiIndexResponse>({
      value: Math.round(value * 100) / 100,
      change: Math.round(change * 100) / 100,
      changeRate: Math.round(changeRate * 100) / 100,
      fetchedAt: new Date().toISOString(),
    });
  }),

  http.get("*/api/v2/stocks/rankings", async ({ request }) => {
    const url = new URL(request.url);
    const type = (url.searchParams.get("type") ??
      "TRADING_VALUE") as RankingApiType;
    const page = Number(url.searchParams.get("page") ?? "1");
    const size = Number(url.searchParams.get("size") ?? "20");

    const allItems = buildRankingItems(type);
    const totalElements = allItems.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = (page - 1) * size;
    const items = allItems.slice(start, start + size);

    return HttpResponse.json<RankingApiResponse>({
      rankingType: type,
      rankUpdatedAt: new Date().toISOString(),
      page,
      size,
      totalElements,
      totalPages,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
      items,
    });
  }),

  http.get("*/api/v1/accounts/:accountId/watchlist", async ({ params }) => {
    return HttpResponse.json<WatchlistResponse>({
      message: "success",
      account_id: Number(params.accountId),
      watchlists: [],
    });
  }),

  http.post(
    "*/api/v1/accounts/:accountId/watchlist",
    async ({ params, request }) => {
      const body = (await request.json()) as { stock_code: string };
      favoriteStockCodes.add(body.stock_code);

      return HttpResponse.json(
        {
          message: "success",
          account_id: Number(params.accountId),
          stock_code: body.stock_code,
        },
        { status: 201 },
      );
    },
  ),

  http.delete(
    "*/api/v1/accounts/:accountId/watchlist/:stockCode",
    async ({ params }) => {
      favoriteStockCodes.delete(params.stockCode as string);

      return HttpResponse.json({ message: "delete_success" });
    },
  ),
];
