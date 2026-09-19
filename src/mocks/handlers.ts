import { http, HttpResponse, type HttpHandler } from "msw";
import type { CreateAccountResponse } from "@/features/account/types/account";
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
];
