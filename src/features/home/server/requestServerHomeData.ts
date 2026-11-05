import type { AccountDetail } from "@/features/account/types/account";
import type { HoldingsResponse } from "@/features/account/types/holdingStock";
import type { OrdersResponse } from "@/features/ai/types/aiTrade";
import { requestServerApi } from "../../../shared/lib/requestServerApi";

export function requestServerHomeData(
  apiBaseUrl: string,
  accessToken: string,
  accountId: number,
) {
  const request = <T>(path: string) =>
    requestServerApi<T>(apiBaseUrl, accessToken, path).catch(() => null);

  // 호출 즉시 병렬 요청 시작 및 실패한 영역만 브라우저 조회로 전환
  return {
    account: request<AccountDetail>(`/api/v1/users/me/accounts/${accountId}`),
    holdings: request<HoldingsResponse>(
      `/api/v1/users/me/accounts/${accountId}/holdings?sort=latest_purchase&order=desc&limit=3`,
    ),
    orders: request<OrdersResponse>(
      `/api/v1/accounts/${accountId}/orders?limit=3&order_status=executed`,
    ),
  };
}
