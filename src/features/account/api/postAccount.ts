import { apiClient } from "@/shared/lib/axios";
import type {
  CreateAccountRequest,
  CreateAccountResponse,
} from "@/features/account/types/account";

export async function postAccount(
  payload: Partial<Pick<CreateAccountRequest, "account_name">> &
    Omit<CreateAccountRequest, "account_name">,
) {
  const { data: createAccountResponse } =
    await apiClient.post<CreateAccountResponse>("/api/v1/users/me/accounts", {
      account_name: "기본계좌",
      ...payload,
    });

  return createAccountResponse;
}
