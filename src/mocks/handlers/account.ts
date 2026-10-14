import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  Account,
  AccountDetail,
  CreateAccountResponse,
  DeleteAccountResponse,
  UpdateAccountNameResponse,
} from "@/features/account/types/account";

export const DEMO_ACCOUNTS: Account[] = [
  {
    account_id: 1,
    account_name: "기본계좌",
    is_duel_account: false,
    cash_balance: 1_240_000,
    total_assets: 13_720_000,
    return_percent: 8.3,
  },
  {
    account_id: 2,
    account_name: "투자계좌",
    is_duel_account: false,
    cash_balance: 500_000,
    total_assets: 650_000,
    return_percent: 8.3,
  },
  {
    account_id: 3,
    account_name: "8월 반도체 집중",
    is_duel_account: true,
    cash_balance: 640_000,
    total_assets: 10_640_000,
    return_percent: 6.4,
  },
  // 완료된 대결(5월 첫 대결/4월 연습 대결)의 계좌는 soft delete되어 계좌 목록에 노출되지 않음
];

export function addDemoAccount(account: Account) {
  DEMO_ACCOUNTS.push(account);
}

export const accountHandlers: HttpHandler[] = [
  http.post("*/api/v1/users/me/accounts", async ({ request }) => {
    const body = (await request.json()) as {
      initial_capital: number;
      account_name: string;
    };

    const accountId =
      Math.max(...DEMO_ACCOUNTS.map((account) => account.account_id)) + 1;
    addDemoAccount({
      account_id: accountId,
      account_name: body.account_name,
      is_duel_account: false,
      cash_balance: body.initial_capital,
      total_assets: body.initial_capital,
      return_percent: 0,
    });

    return HttpResponse.json<CreateAccountResponse>(
      {
        message: "success",
        account_id: accountId,
        account_name: body.account_name,
        initial_capital: body.initial_capital,
      },
      { status: 201 },
    );
  }),

  http.get("*/api/v1/users/me/accounts", async () => {
    return HttpResponse.json<Account[]>(DEMO_ACCOUNTS);
  }),

  http.patch(
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

  http.delete("*/api/v1/users/me/accounts/:accountId", async () => {
    return HttpResponse.json<DeleteAccountResponse>({
      message: "delete_success",
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
];
