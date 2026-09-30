import { apiClient } from "@/shared/lib/axios";

export async function postReissue() {
  const { data } = await apiClient.post("/api/v1/auth/reissue");

  return data;
}
