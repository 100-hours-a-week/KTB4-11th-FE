import { apiClient } from "@/shared/lib/axios";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
} from "@/features/stock/types/stockTrade";

export async function postOrder(
  accountId: number,
  payload: CreateOrderRequest,
) {
  const { data: createOrderResponse } =
    await apiClient.post<CreateOrderResponse>(
      `/api/v1/accounts/${accountId}/orders`,
      payload,
    );

  return createOrderResponse;
}
