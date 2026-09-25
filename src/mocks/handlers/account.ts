import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  AccountDetail,
  AccountListResponse,
  CreateAccountResponse,
  UpdateAccountNameResponse,
} from "@/features/account/types/account";

export const accountHandlers: HttpHandler[] = [
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

  http.put(
    "*/api/v1/users/me/accounts/:accountId",
    async ({ request, params }) => {
      const body = (await request.json()) as { account_name: string };

      if (
        !body.account_name ||
        body.account_name.length < 1 ||
        body.account_name.length > 20
      ) {
        return HttpResponse.json(
          { code: "INVALID_REQUEST", message: "요청 형식이 올바르지 않습니다" },
          { status: 400 },
        );
      }

      return HttpResponse.json<UpdateAccountNameResponse>({
        message: "success",
        account_id: Number(params.accountId),
        account_name: body.account_name,
      });
    },
  ),

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
];
