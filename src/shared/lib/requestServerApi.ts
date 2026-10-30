// Next 서버에서 백엔드로 API 요청을 보내는 공통 함수 파일
export async function requestServerApi<T>(
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
  if (!response.ok) throw new Error(`서버 API 요청 실패 (${response.status})`);

  return response.json() as Promise<T>;
}
