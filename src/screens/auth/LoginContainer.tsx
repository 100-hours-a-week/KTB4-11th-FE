"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useUserQuery } from "@/features/user/hooks/useUserQuery";
import stockSpoonLogo from "@/assets/images/stockspoon-logo-full.png";
import { KakaoLoginButton } from "@/features/auth/components/KakaoLoginButton";
import { TermsAgreementNotice } from "@/features/auth/components/TermsAgreementNotice";
import { Splash } from "@/shared/components/Splash";

export function LoginContainer() {
  const router = useRouter();
  const {
    data: user,
    isSuccess,
    isLoading,
  } = useUserQuery({ skipAuthRedirect: true, retry: false });

  useEffect(() => {
    if (!isSuccess) return;

    if (!user.onboarding_completed) {
      toast.info("온보딩을 완료하지 않았어요");
      router.replace("/onboarding");
    } else {
      router.replace("/home");
    }
  }, [isSuccess, user, router]);

  if (isLoading || isSuccess) return <Splash />;

  return (
    <div className="bg-login-gradient flex h-full flex-col items-center justify-center px-5 pb-10">
      <div className="flex flex-col items-center">
        <Image
          src={stockSpoonLogo}
          alt="StockSpoon"
          className="h-24 w-auto"
          priority
        />
        <h1 className="heading-1-bold text-text-neutral-primary mt-4 text-center">
          AI와 쌓은 경험이
          <br />
          나만의 투자 감각으로
        </h1>
        <p className="body-2-regular text-text-neutral-secondary mt-2 text-center">
          실시간 시장 데이터 기반 AI 모의투자 서비스
        </p>
      </div>

      <div className="animate-in fade-in-0 mt-16 w-full duration-500">
        <KakaoLoginButton />
        <TermsAgreementNotice action="가입" className="mt-5 text-center" />
      </div>
    </div>
  );
}
