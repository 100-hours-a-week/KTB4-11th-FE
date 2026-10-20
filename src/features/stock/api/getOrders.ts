import { apiClient } from "@/shared/lib/axios";
import type {
  OrderSide,
  OrderStatus,
  OrdersResponse,
} from "@/features/ai/types/aiTrade";

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  orderSide?: OrderSide;
  orderStatus?: OrderStatus;
  stockCode?: string;
}

export async function getOrders(
  accountId: number,
  { page, limit, orderSide, orderStatus, stockCode }: GetOrdersParams = {},
) {
  const { data: ordersResponse } = await apiClient.get<OrdersResponse>(
    `/api/v1/accounts/${accountId}/orders`,
    {
      params: {
        page,
        limit,
        order_side: orderSide,
        order_status: orderStatus,
        stock_code: stockCode,
      },
    },
  );

  return ordersResponse;
}
