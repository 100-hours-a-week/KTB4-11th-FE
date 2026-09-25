import { http, HttpResponse, type HttpHandler } from "msw";
import type { KakaoLoginResponse } from "@/features/auth/types/login";

export const authHandlers: HttpHandler[] = [
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
];
