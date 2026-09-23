import { apiClient } from "@/shared/lib/axios";
import type { AccountListResponse } from "@/features/account/types/account";

export async function getAccountList() {
  const { data } = await apiClient.get<AccountListResponse>(
    "/api/v1/users/me/accounts",
  );

  return data;
}
