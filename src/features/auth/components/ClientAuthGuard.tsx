"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useUserQuery } from "@/features/user/hooks/useUserQuery";
import { Splash } from "@/shared/components/Splash";

type GuardMode = "authenticated" | "onboarded" | "onboarding" | "login";

// 액세스 쿠키 만료·누락 또는 MSW 사용 시 브라우저에서 인증 확인
export function ClientAuthGuard({
  mode,
  children,
}: {
  mode: GuardMode;
  children: ReactNode;
}) {
  const router = useRouter();
  // 서버가 재발급 쿠키를 받을 수 없어 토큰 재발급은 브라우저에서 처리
  const {
    data: user,
    isSuccess,
    isError,
    error,
  } = useUserQuery({ skipAuthRedirect: true, retry: false });
  const unauthenticated =
    isError && isAxiosError(error) && error.response?.status === 401;
  let destination: string | null = null;
  if (unauthenticated && mode !== "login") destination = "/";
  if (isSuccess) {
    if (mode === "login")
      destination = user.onboarding_completed ? "/home" : "/onboarding";
    if (mode === "onboarded" && !user.onboarding_completed)
      destination = "/onboarding";
    if (mode === "onboarding" && user.onboarding_completed)
      destination = "/home";
  }

  useEffect(() => {
    if (destination) router.replace(destination);
  }, [destination, router]);

  // 네트워크·서버 장애를 로그아웃으로 오판하지 않도록 오류 화면으로 전달
  if (isError && !unauthenticated) throw error;
  // 세션 복구와 화면 이동 중 스플래시 유지, 비로그인 확정 후 로그인 화면 표시
  if (mode === "login") {
    return unauthenticated ? <>{children}</> : <Splash />;
  }
  if (!isSuccess || destination) return <Splash />;
  return <>{children}</>;
}
