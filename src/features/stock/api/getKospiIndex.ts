import { apiClient } from "@/shared/lib/axios";
import type { KospiIndexResponse } from "@/features/stock/types/kospiIndex";

export async function getKospiIndex() {
  const { data: kospiIndexResponse } = await apiClient.get<KospiIndexResponse>(
    "/api/v1/market/indices/kospi",
  );

  return kospiIndexResponse;
}
