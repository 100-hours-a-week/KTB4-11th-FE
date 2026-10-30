import type { AccountDetail } from "@/features/account/types/account";

import { requestServerApi } from "../../../shared/lib/requestServerApi";

export async function requestServerAccountDetail(
  apiBaseUrl: string,
  accessToken: string,
  accountId: number,
) {
  return requestServerApi<AccountDetail>(
    apiBaseUrl,
    accessToken,
    `/api/v1/users/me/accounts/${accountId}`,
  );
}
