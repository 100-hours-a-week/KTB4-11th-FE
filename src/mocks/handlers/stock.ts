import { http, HttpResponse, type HttpHandler } from "msw";
import type { StockInfoResponse } from "@/features/stock/types/stockDetail";
import type { StockSearchResponse } from "@/features/stock/types/stockSearch";
import type {
  WatchlistItem,
  WatchlistResponse,
} from "@/features/stock/types/watchlist";

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

// 종목 상세 화면에서 쓰는 실제 종목 코드 (랭킹 목록의 합성 코드와 구분)
const REAL_STOCK_CODES: Record<string, StockPoolEntry> = {
  "035420": STOCK_POOL[5], // NAVER
  "005930": STOCK_POOL[0], // 삼성전자
};

const REAL_CODE_BY_ENTRY = new Map(
  Object.entries(REAL_STOCK_CODES).map(([code, entry]) => [entry, code]),
);

function resolveStockPoolEntry(stockCode: string): StockPoolEntry | null {
  if (stockCode in REAL_STOCK_CODES) return REAL_STOCK_CODES[stockCode];

  const lastDash = stockCode.lastIndexOf("-");
  if (lastDash === -1) return null;

  const index = Number(stockCode.slice(lastDash + 1));
  if (Number.isNaN(index)) return null;

  return STOCK_POOL[index % STOCK_POOL.length];
}

const favoriteItems = new Map<string, WatchlistItem>([
  [
    "035420",
    {
      stock_code: "035420",
      stock_name: "NAVER",
      sector: "플랫폼",
    },
  ],
]);

export const stockHandlers: HttpHandler[] = [
  http.get("*/api/v2/stocks/:stockCode", async ({ params }) => {
    const stockCode = String(params.stockCode);
    const entry = resolveStockPoolEntry(stockCode);

    if (!entry) {
      return HttpResponse.json(
        { message: "존재하지 않는 종목으로 확인됨", code: "STOCK_NOT_FOUND" },
        { status: 404 },
      );
    }

    return HttpResponse.json<StockInfoResponse>({
      stock_code: stockCode,
      stock_name: entry.stock_name,
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

  http.get("*/api/v1/search", async ({ request }) => {
    const url = new URL(request.url);
    const keyword = (url.searchParams.get("keyword") ?? "").trim();
    const normalized = keyword.toLowerCase();

    const pool = STOCK_POOL.map((entry, index) => ({
      stock_code: REAL_CODE_BY_ENTRY.get(entry) ?? `search-${index}`,
      stock_name: entry.stock_name,
      market: "KOSPI",
      sector: entry.sector_name,
    }));

    const stocks = normalized
      ? pool.filter(
          (stock) =>
            stock.stock_name.toLowerCase().includes(normalized) ||
            stock.stock_code.toLowerCase().includes(normalized),
        )
      : [];

    return HttpResponse.json<StockSearchResponse>({
      keyword,
      total_count: stocks.length,
      stocks,
    });
  }),
];
