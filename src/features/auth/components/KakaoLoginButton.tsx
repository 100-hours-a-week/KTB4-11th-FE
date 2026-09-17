"use client";

import KakaoIcon from "@/assets/icons/social/kakao.svg";
import { getKakaoAuthUrl } from "@/features/auth/utils/getKakaoAuthUrl";
import { createOAuthState } from "@/features/auth/utils/oauthState";

export function KakaoLoginButton() {
  const handleClick = () => {
    const state = createOAuthState();
    window.location.href = getKakaoAuthUrl(state);
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-r3 body-1-semibold flex h-14 w-full items-center justify-center gap-2 bg-[#FEE500] text-[#191919]"
    >
      <KakaoIcon width={20} height={20} />
      카카오로 시작하기
    </button>
  );
}
