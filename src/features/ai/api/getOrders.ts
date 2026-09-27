import { apiClient } from "@/shared/lib/axios";
import type { OrdersResponse } from "@/features/ai/types/aiTrade";

export async function getOrders(accountId: number) {
  const { data: ordersResponse } = await apiClient.get<OrdersResponse>(
    `/api/v1/accounts/${accountId}/orders`,
  );

  return ordersResponse;
}
