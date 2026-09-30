import { apiClient } from "@/shared/lib/axios";
import type {
  UpdateAccountNameRequest,
  UpdateAccountNameResponse,
} from "@/features/account/types/account";

export async function patchAccountName(
  accountId: number,
  payload: UpdateAccountNameRequest,
) {
  const { data: updateAccountNameResponse } =
    await apiClient.patch<UpdateAccountNameResponse>(
      `/api/v1/users/me/accounts/${accountId}`,
      payload,
    );

  return updateAccountNameResponse;
}
