import { apiClient } from "@/shared/lib/axios";
import type { OrderRequestStatus } from "@/features/stock/types/stockTrade";

export async function getOrderRequestStatus(
  accountId: number,
  requestId: string,
) {
  const { data: orderRequestStatus } = await apiClient.get<OrderRequestStatus>(
    `/api/v3/accounts/${accountId}/order-requests/${requestId}`,
  );

  return orderRequestStatus;
}
