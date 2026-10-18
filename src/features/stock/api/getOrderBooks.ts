import { marketApiClient } from "@/shared/lib/marketApiClient";
import type { MarketOrderBook } from "@/features/stock/types/market";

export async function getOrderBooks(codes: string[]) {
  const { data: orderBooks } = await marketApiClient.get<MarketOrderBook[]>(
    "/orderbooks",
    { params: { codes: codes.join(",") } },
  );

  return orderBooks;
}
