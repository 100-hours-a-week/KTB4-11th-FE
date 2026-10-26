import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { requestServerUser } from "./requestServerUser";

// 같은 페이지 요청의 사용자 조회만 재사용하고 다른 요청과는 결과 공유 금지
export const getServerUser = cache(async () => {
  // 서버 요청을 처리할 수 없는 브라우저 MSW 환경에서는 클라이언트 인증 사용
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") return null;

  const accessToken = (await cookies()).get("access_token")?.value;
  if (!accessToken) return null;

  const baseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) throw new Error("API 서버 주소가 설정되지 않았어요.");
  return requestServerUser(baseUrl, accessToken);
});
