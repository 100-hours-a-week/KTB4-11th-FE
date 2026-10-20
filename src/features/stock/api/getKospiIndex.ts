import { marketApiClient } from "@/shared/lib/marketApiClient";
import type { KospiIndexResponse } from "@/features/stock/types/kospiIndex";

export async function getKospiIndex() {
  const { data: kospiIndexResponse } =
    await marketApiClient.get<KospiIndexResponse>("/indices/KOSPI");

  return kospiIndexResponse;
}
