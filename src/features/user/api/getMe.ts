import type { AxiosRequestConfig } from "axios";
import { apiClient } from "@/shared/lib/axios";
import type { UserProfile } from "@/features/user/types/user";

export async function getMe(config?: AxiosRequestConfig) {
  const { data: userProfile } = await apiClient.get<UserProfile>(
    "/api/v1/users/me",
    config,
  );

  return {
    ...userProfile,
    profile_image_url:
      userProfile.profile_image_url?.replace(/^http:/, "https:") ?? null,
  };
}
