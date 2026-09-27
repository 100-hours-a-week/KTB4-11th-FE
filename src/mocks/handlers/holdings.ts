import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  HoldingApiItem,
  HoldingsResponse,
} from "@/features/account/types/holdingStock";

const HOLDINGS: HoldingApiItem[] = [
  {
    stock_code: "005930",
    stock_name: "삼성전자",
    industry_name: "반도체",
    quantity: 12,
    total_cost_basis: 854_400,
    average_purchase_price: 71_200,
    current_price: 74_100,
    total_value: 889_200,
    unrealized_pnl: 34_800,
    return_percent: 4.0,
  },
  {
    stock_code: "035720",
    stock_name: "카카오",
    industry_name: "플랫폼",
    quantity: 30,
    total_cost_basis: 1_245_000,
    average_purchase_price: 41_500,
    current_price: 43_000,
    total_value: 1_290_000,
    unrealized_pnl: 45_000,
    return_percent: 3.6,
  },
  {
    stock_code: "035420",
    stock_name: "NAVER",
    industry_name: "플랫폼",
    quantity: 4,
    total_cost_basis: 892_000,
    average_purchase_price: 223_000,
    current_price: 221_500,
    total_value: 886_000,
    unrealized_pnl: -6_000,
    return_percent: -0.8,
  },
];

function sortHoldings(holdings: HoldingApiItem[], sort: string | null) {
  const sorted = [...holdings];

  if (sort === "return_rate") {
    sorted.sort((a, b) => b.return_percent - a.return_percent);
  } else if (sort === "market_value") {
    sorted.sort((a, b) => b.total_value - a.total_value);
  }

  return sorted;
}

export const holdingsHandlers: HttpHandler[] = [
  http.get(
    "*/api/v1/users/me/accounts/:accountId/holdings",
    async ({ request }) => {
      const sort = new URL(request.url).searchParams.get("sort");

      return HttpResponse.json<HoldingsResponse>({
        message: "success",
        account_id: 1,
        holdings: sortHoldings(HOLDINGS, sort),
      });
    },
  ),
];
