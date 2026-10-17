import { apiClient } from "@/shared/lib/axios";
import type { CancelOrderResponse } from "@/features/stock/types/stockTrade";

export async function patchCancelOrder(accountId: number, orderId: number) {
  const { data: cancelOrderResponse } =
    await apiClient.patch<CancelOrderResponse>(
      `/api/v1/accounts/${accountId}/orders/${orderId}`,
      { status: "cancelled" },
    );

  return cancelOrderResponse;
}
