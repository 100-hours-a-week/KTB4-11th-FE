import type { UserProfile } from "@/features/user/types/user";

// 서버에서는 액세스 쿠키로 사용자 조회만 수행하고 토큰 재발급은 브라우저에서 처리
export async function requestServerUser(
  apiBaseUrl: string,
  accessToken: string,
): Promise<UserProfile | null> {
  const response = await fetch(new URL("/api/v1/users/me", apiBaseUrl), {
    headers: { Cookie: `access_token=${accessToken}` },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status === 401) return null;
  if (!response.ok)
    throw new Error(`사용자 정보 조회 실패 (${response.status})`);

  const user: unknown = await response.json();
  if (
    !user ||
    typeof user !== "object" ||
    !("nickname" in user) ||
    typeof user.nickname !== "string" ||
    !("onboarding_completed" in user) ||
    typeof user.onboarding_completed !== "boolean" ||
    !("profile_image_url" in user) ||
    (user.profile_image_url !== null &&
      typeof user.profile_image_url !== "string")
  )
    throw new Error("사용자 정보 응답 형식이 올바르지 않아요.");

  return {
    nickname: user.nickname,
    onboarding_completed: user.onboarding_completed,
    profile_image_url:
      user.profile_image_url?.replace(/^http:/, "https:") ?? null,
  };
}
