import type { ReactNode } from "react";

// 계좌 생성 직후 완료 안내가 표시되도록 온보딩 완료 여부 검사를 생성 페이지로 한정
export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
