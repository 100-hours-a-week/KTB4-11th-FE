import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { SELECTED_ACCOUNT_COOKIE } from "@/features/account/utils/selectedAccountCookie";
import { requestServerAccountDetail } from "./requestServerAccountData";

function parseAccountId(value?: string) {
  if (!value || !/^\d+$/.test(value)) return undefined;

  const accountId = Number(value);
  return Number.isSafeInteger(accountId) && accountId > 0
    ? accountId
    : undefined;
}

// 현재 요청 안에서만 계좌 조회를 재사용하고 브라우저 선택값은 쿠키에서 읽기
export const getServerAccountContext = cache(async () => {
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") return null;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const selectedAccountId = parseAccountId(
    cookieStore.get(SELECTED_ACCOUNT_COOKIE)?.value,
  );
  if (!accessToken || selectedAccountId === undefined) return null;

  const apiBaseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) throw new Error("API 서버 주소가 설정되지 않았어요.");

  return { apiBaseUrl, accessToken, selectedAccountId };
});

export const getServerAccountData = cache(async () => {
  const context = await getServerAccountContext();
  if (!context) return null;
  const { apiBaseUrl, accessToken, selectedAccountId } = context;

  const account = await requestServerAccountDetail(
    apiBaseUrl,
    accessToken,
    selectedAccountId,
  );

  return account ? { account, selectedAccountId } : null;
});
