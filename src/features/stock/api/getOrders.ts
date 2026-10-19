import { apiClient } from "@/shared/lib/axios";
import type { OrderSide, OrdersResponse } from "@/features/ai/types/aiTrade";

interface GetOrdersParams {
  page?: number;
  limit?: number;
  orderSide?: OrderSide;
}

export async function getOrders(
  accountId: number,
  { page, limit, orderSide }: GetOrdersParams = {},
) {
  const { data: ordersResponse } = await apiClient.get<OrdersResponse>(
    `/api/v1/accounts/${accountId}/orders`,
    { params: { page, limit, order_side: orderSide } },
  );

  return ordersResponse;
}
