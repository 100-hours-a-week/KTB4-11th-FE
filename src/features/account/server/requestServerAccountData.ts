import type { AccountDetail } from "@/features/account/types/account";

async function requestServerApi<T>(
  apiBaseUrl: string,
  accessToken: string,
  path: string,
): Promise<T | null> {
  const response = await fetch(new URL(path, apiBaseUrl), {
    headers: { Cookie: `access_token=${accessToken}` },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
  });

  if (response.status === 401 || response.status === 404) return null;
  if (!response.ok) throw new Error(`계좌 정보 조회 실패 (${response.status})`);

  return response.json() as Promise<T>;
}

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
