import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  AccountDetail,
  AccountListResponse,
  CreateAccountResponse,
} from "@/features/account/types/account";
import type { HoldingsResponse } from "@/features/account/types/holdingStock";
import type { KakaoLoginResponse } from "@/features/auth/types/login";

export const handlers: HttpHandler[] = [
  http.post("*/api/v1/auth/login", async () => {
    return HttpResponse.json<KakaoLoginResponse>({
      message: "success",
      user_id: 1,
      access_token: "mock-access-token",
      token_type: "Bearer",
      expires_in: 1800,
      onboarding_required: true,
    });
  }),

  http.post("*/api/v1/users/me/accounts", async ({ request }) => {
    const body = (await request.json()) as {
      initial_capital: number;
      account_name: string;
    };

    return HttpResponse.json<CreateAccountResponse>(
      {
        message: "success",
        account_id: 1,
        account_name: body.account_name,
        initial_capital: body.initial_capital,
      },
      { status: 201 },
    );
  }),

  http.get("*/api/v1/users/me/accounts", async () => {
    return HttpResponse.json<AccountListResponse>({
      message: "success",
      accounts: [
        {
          account_id: 1,
          account_name: "기본계좌",
          is_duel_account: false,
          cash_balance: 1_240_000,
          total_assets: 13_720_000,
          return_percent: 8.3,
        },
      ],
    });
  }),

  http.get("*/api/v1/users/me/accounts/:accountId", async () => {
    return HttpResponse.json<AccountDetail>({
      message: "success",
      account_id: 1,
      account_name: "기본계좌",
      is_duel_account: false,
      initial_capital: 10_000_000,
      cash_balance: 1_240_000,
      available_cash: 1_240_000,
      holdings_market_value: 12_480_000,
      total_assets: 13_720_000,
      return_percent: 8.3,
      executed_trade_count: 12,
    });
  }),

  http.get("*/api/v1/users/me/accounts/:accountId/holdings", async () => {
    return HttpResponse.json<HoldingsResponse>({
      message: "success",
      account_id: 1,
      holdings: [
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
      ],
    });
  }),
];
