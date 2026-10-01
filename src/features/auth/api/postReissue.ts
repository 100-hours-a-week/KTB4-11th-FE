import type { AxiosRequestConfig } from "axios";
import { apiClient } from "@/shared/lib/axios";

export async function postReissue(config?: AxiosRequestConfig) {
  const { data } = await apiClient.post(
    "/api/v1/auth/reissue",
    undefined,
    config,
  );

  return data;
}
