import type { HoldingsQueryParams } from "@/features/account/types/holdingStock";
import type { GetOrdersParams } from "@/features/stock/api/getOrders";

// 홈 서버 초기 데이터와 브라우저 조회가 같은 캐시를 사용하기 위한 조회 조건 통일
export const HOME_HOLDINGS_PARAMS = {
  sort: "latest_purchase",
  order: "desc",
  limit: 3,
} satisfies HoldingsQueryParams;

export const HOME_ORDERS_PARAMS = {
  limit: 3,
  orderStatus: "executed",
} satisfies GetOrdersParams;
