import { apiClient } from "@/shared/lib/axios";
import type { DeleteAccountResponse } from "@/features/account/types/account";

export async function deleteAccount(accountId: number) {
  const { data: deleteAccountResponse } =
    await apiClient.delete<DeleteAccountResponse>(
      `/api/v1/users/me/accounts/${accountId}`,
    );

  return deleteAccountResponse;
}
