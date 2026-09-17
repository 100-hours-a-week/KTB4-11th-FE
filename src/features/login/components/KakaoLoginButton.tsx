import KakaoIcon from "@/assets/icons/social/kakao.svg";
import { getKakaoAuthUrl } from "@/features/login/lib/getKakaoAuthUrl";

export function KakaoLoginButton() {
  return (
    <a
      href={getKakaoAuthUrl()}
      className="rounded-r3 body-1-semibold flex h-14 w-full items-center justify-center gap-2 bg-[#FEE500] text-[#191919]"
    >
      <KakaoIcon width={20} height={20} />
      카카오로 시작하기
    </a>
  );
}
