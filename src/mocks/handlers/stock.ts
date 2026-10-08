import { http, HttpResponse, type HttpHandler } from "msw";
import type { KospiIndexResponse } from "@/features/stock/types/kospiIndex";
import type {
  RankingApiItem,
  RankingApiResponse,
  RankingApiType,
} from "@/features/stock/types/ranking";
import type {
  WatchlistItem,
  WatchlistResponse,
} from "@/features/stock/types/watchlist";

const BASE_VALUE = 2817.42;
const BASE_CHANGE = -12.5;

interface StockPoolEntry {
  stock_name: string;
  sector_name: string;
  logo_url: string | null;
  price: number;
  change_rate: number;
}

const STOCK_POOL: StockPoolEntry[] = [
  {
    stock_name: "삼성전자",
    sector_name: "반도체",
    logo_url: null,
    price: 74_100,
    change_rate: 1.5,
  },
  {
    stock_name: "SK하이닉스",
    sector_name: "반도체",
    logo_url: null,
    price: 183_000,
    change_rate: 2.6,
  },
  {
    stock_name: "알테오젠",
    sector_name: "바이오",
    logo_url: null,
    price: 312_000,
    change_rate: 7.8,
  },
  {
    stock_name: "카카오",
    sector_name: "플랫폼",
    logo_url: null,
    price: 43_000,
    change_rate: -1.5,
  },
  {
    stock_name: "두산에너빌리티",
    sector_name: "기계",
    logo_url: null,
    price: 51_200,
    change_rate: 3.3,
  },
  {
    stock_name: "NAVER",
    sector_name: "플랫폼",
    logo_url: null,
    price: 221_500,
    change_rate: -0.8,
  },
  {
    stock_name: "LG에너지솔루션",
    sector_name: "2차전지",
    logo_url: null,
    price: 412_000,
    change_rate: 0.9,
  },
  {
    stock_name: "현대차",
    sector_name: "자동차",
    logo_url: null,
    price: 245_000,
    change_rate: -2.1,
  },
  {
    stock_name: "LG화학",
    sector_name: "화학",
    logo_url: null,
    price: 398_500,
    change_rate: 1.1,
  },
  {
    stock_name: "삼성SDI",
    sector_name: "2차전지",
    logo_url: null,
    price: 356_000,
    change_rate: -0.4,
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

const favoriteItems = new Map<string, WatchlistItem>();

function resolveStockPoolEntry(stockCode: string): StockPoolEntry | null {
  const lastDash = stockCode.lastIndexOf("-");
  if (lastDash === -1) return null;

  const index = Number(stockCode.slice(lastDash + 1));
  if (Number.isNaN(index)) return null;

  return STOCK_POOL[index % STOCK_POOL.length];
}

function buildRankingItems(type: RankingApiType): RankingApiItem[] {
  const total = MAX_BY_TYPE[type];

  return Array.from({ length: total }, (_, index) => {
    const base = STOCK_POOL[index % STOCK_POOL.length];
    const stockCode = `${type}-${index}`;

    return {
      ...base,
      rank: index + 1,
      stock_code: stockCode,
      is_favorite: favoriteItems.has(stockCode),
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
      ranking_type: type,
      updated_at: new Date().toISOString(),
      page,
      size,
      total_elements: totalElements,
      total_pages: totalPages,
      has_previous: page > 1,
      has_next: page < totalPages,
      items,
    });
  }),

  http.get("*/api/v2/users/me/watchlist", async () => {
    return HttpResponse.json<WatchlistResponse>({
      message: "success",
      watchlists: Array.from(favoriteItems.values()),
    });
  }),

  http.post("*/api/v2/users/me/watchlist", async ({ request }) => {
    const body = (await request.json()) as { stock_code: string };
    const entry = resolveStockPoolEntry(body.stock_code);

    if (entry) {
      favoriteItems.set(body.stock_code, {
        stock_code: body.stock_code,
        stock_name: entry.stock_name,
        sector: entry.sector_name,
        current_price: entry.price,
        price_change_percent: entry.change_rate,
      });
    }

    return HttpResponse.json(
      { message: "success", stock_code: body.stock_code },
      { status: 201 },
    );
  }),

  http.delete("*/api/v2/users/me/watchlist/:stockCode", async ({ params }) => {
    favoriteItems.delete(params.stockCode as string);

    return HttpResponse.json({ message: "delete_success" });
  }),
];
