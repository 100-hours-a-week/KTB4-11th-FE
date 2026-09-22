import { apiClient } from "@/shared/lib/axios";
import type {
  HoldingsQueryParams,
  HoldingsResponse,
} from "@/features/account/types/holdingStock";

export async function getHoldings(
  accountId: number,
  params?: HoldingsQueryParams,
) {
  const { data } = await apiClient.get<HoldingsResponse>(
    `/api/v1/users/me/accounts/${accountId}/holdings`,
    { params },
  );

  return data;
}
