import { http, HttpResponse, type HttpHandler } from "msw";
import type { KakaoLoginResponse } from "@/features/auth/types/login";

export const authHandlers: HttpHandler[] = [
  http.get("*/api/v1/auth/csrf", async () => {
    return HttpResponse.json({
      token: "mock-csrf-token",
      header_name: "X-CSRF-Token",
    });
  }),

  http.post("*/api/v1/auth/login", async () => {
    return HttpResponse.json<KakaoLoginResponse>({
      code: "LOGIN_SUCCESS",
      message: "로그인되었습니다.",
      user_id: 1,
    });
  }),

  http.post("*/api/v1/auth/logout", async () => {
    return HttpResponse.json({
      code: "LOGOUT_SUCCESS",
      message: "로그아웃되었습니다.",
    });
  }),
];
