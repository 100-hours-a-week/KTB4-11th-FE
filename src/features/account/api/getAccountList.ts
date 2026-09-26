import { apiClient } from "@/shared/lib/axios";
import type { Account } from "@/features/account/types/account";

export async function getAccountList() {
  const { data: accounts } = await apiClient.get<Account[]>(
    "/api/v1/users/me/accounts",
  );

  return accounts;
}
