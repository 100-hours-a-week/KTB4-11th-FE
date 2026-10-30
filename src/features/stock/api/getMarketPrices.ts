import { marketApiClient } from "@/shared/lib/marketApiClient";
import type { MarketPrice } from "@/features/stock/types/market";

export async function getMarketPrices(codes: string[]) {
  const { data: prices } = await marketApiClient.get<MarketPrice[]>("/prices", {
    params: { codes: codes.join(",") },
  });

  return prices;
}
