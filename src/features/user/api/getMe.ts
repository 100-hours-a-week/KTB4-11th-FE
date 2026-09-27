import { apiClient } from "@/shared/lib/axios";
import type { UserProfile } from "@/features/user/types/user";

export async function getMe() {
  const { data: userProfile } =
    await apiClient.get<UserProfile>("/api/v1/users/me");

  return userProfile;
}
