import { http, HttpResponse, type HttpHandler } from "msw";
import type { UserProfile } from "@/features/user/types/user";
import type { ProfileImagePresignedUrlResponse } from "@/features/user/types/profileImagePresignedUrl";

const mockUser: UserProfile = {
  nickname: "스푼러버",
  profile_image_url: null,
  onboarding_completed: true,
};

let nextProfileImageId = 1;

export const userHandlers: HttpHandler[] = [
  http.get("*/api/v1/users/me", async () => {
    return HttpResponse.json<UserProfile>(mockUser);
  }),

  http.patch("*/api/v1/users/me", async ({ request }) => {
    const body = (await request.json()) as {
      nickname?: string;
      profile_image_key?: string | null;
    };

    if (body.nickname) mockUser.nickname = body.nickname;
    if (body.profile_image_key !== undefined) {
      mockUser.profile_image_url = body.profile_image_key
        ? `https://mock-s3.stockspoon.local/uploads/${body.profile_image_key}`
        : null;
    }

    return HttpResponse.json({ message: "success" });
  }),

  http.delete("*/api/v1/users/me", async () => {
    return HttpResponse.json({ message: "withdraw_success" });
  }),

  http.post(
    "*/api/v1/users/me/profile-image/presigned-url",
    async ({ request }) => {
      const body = (await request.json()) as {
        content_type: string;
        content_length: number;
      };

      if (!body.content_type?.startsWith("image/")) {
        return HttpResponse.json(
          {
            message: "지원하지 않는 이미지 형식이에요",
            code: "USER_INVALID_PROFILE_IMAGE",
          },
          { status: 400 },
        );
      }

      const key = `profile-${nextProfileImageId++}.${body.content_type.split("/")[1]}`;

      return HttpResponse.json<ProfileImagePresignedUrlResponse>({
        presigned_url: `https://mock-s3.stockspoon.local/uploads/${key}`,
        profile_image_key: key,
      });
    },
  ),

  http.put("https://mock-s3.stockspoon.local/uploads/:key", async () => {
    return HttpResponse.json({});
  }),
];
