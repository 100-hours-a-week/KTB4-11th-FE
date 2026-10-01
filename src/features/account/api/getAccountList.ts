import type { AxiosRequestConfig } from "axios";
import { apiClient } from "@/shared/lib/axios";
import type { Account } from "@/features/account/types/account";

export async function getAccountList(config?: AxiosRequestConfig) {
  const { data: accounts } = await apiClient.get<Account[]>(
    "/api/v1/users/me/accounts",
    config,
  );

  return accounts;
}
