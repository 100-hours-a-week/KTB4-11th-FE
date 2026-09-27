import { apiClient } from "@/shared/lib/axios";
import type { AccountDetail } from "@/features/account/types/account";

export async function getAccountDetail(accountId: number) {
  const { data: accountDetail } = await apiClient.get<AccountDetail>(
    `/api/v1/users/me/accounts/${accountId}`,
  );

  return accountDetail;
}
