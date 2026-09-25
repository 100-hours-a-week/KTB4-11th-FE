import { apiClient } from "@/shared/lib/axios";
import type {
  UpdateAccountNameRequest,
  UpdateAccountNameResponse,
} from "@/features/account/types/account";

export async function putAccountName(
  accountId: number,
  payload: UpdateAccountNameRequest,
) {
  const { data } = await apiClient.put<UpdateAccountNameResponse>(
    `/api/v1/users/me/accounts/${accountId}`,
    payload,
  );

  return data;
}
