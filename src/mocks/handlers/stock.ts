import { http, HttpResponse, type HttpHandler } from "msw";
import type { KospiIndexResponse } from "@/features/stock/types/kospiIndex";

export const stockHandlers: HttpHandler[] = [
  http.get("*/api/v1/market/indices/kospi", async () => {
    return HttpResponse.json<KospiIndexResponse>({
      value: 2817.42,
      change: -12.5,
      changeRate: -0.44,
      fetchedAt: new Date().toISOString(),
    });
  }),
];
