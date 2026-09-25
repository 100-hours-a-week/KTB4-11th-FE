import { apiClient } from "@/shared/lib/axios";

export async function postLogout() {
  const { data } = await apiClient.post<{ message: string }>(
    "/api/v1/auth/logout",
  );

  return data;
}
