import { http, HttpResponse, type HttpHandler } from "msw";
import type { KospiIndexResponse } from "@/features/stock/types/kospiIndex";

const BASE_VALUE = 2817.42;
const BASE_CHANGE = -12.5;

export const stockHandlers: HttpHandler[] = [
  http.get("*/api/v1/market/indices/kospi", async () => {
    const fluctuation = (Math.random() - 0.5) * 10;
    const value = BASE_VALUE + fluctuation;
    const change = BASE_CHANGE + fluctuation;
    const changeRate = (change / (value - change)) * 100;

    return HttpResponse.json<KospiIndexResponse>({
      value: Math.round(value * 100) / 100,
      change: Math.round(change * 100) / 100,
      changeRate: Math.round(changeRate * 100) / 100,
      fetchedAt: new Date().toISOString(),
    });
  }),
];
