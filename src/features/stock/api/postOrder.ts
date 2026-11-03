import { apiClient } from "@/shared/lib/axios";
import type {
  CreateOrderAcceptedResponse,
  CreateOrderRequest,
} from "@/features/stock/types/stockTrade";

export async function postOrder(
  accountId: number,
  payload: CreateOrderRequest,
) {
  const { data: createOrderAcceptedResponse } =
    await apiClient.post<CreateOrderAcceptedResponse>(
      `/api/v1/accounts/${accountId}/orders`,
      payload,
      { headers: { "Idempotency-Key": crypto.randomUUID() } },
    );

  return createOrderAcceptedResponse;
}
