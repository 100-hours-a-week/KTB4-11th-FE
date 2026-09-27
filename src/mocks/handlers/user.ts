import { http, HttpResponse, type HttpHandler } from "msw";
import type { UserProfile } from "@/features/user/types/user";

export const userHandlers: HttpHandler[] = [
  http.get("*/api/v1/users/me", async () => {
    return HttpResponse.json<UserProfile>({
      user_id: 1,
      nickname: "스푼러버",
      profile_image: null,
    });
  }),
];
