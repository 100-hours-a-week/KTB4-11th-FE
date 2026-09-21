"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/Button";
import WalletHappyIcon from "@/assets/icons/stockspoon/wallet-happy.svg";

interface OnboardingCompleteContainerProps {
  amount: number;
  isAiDelegated: boolean;
}

export function OnboardingCompleteContainer({
  amount,
  isAiDelegated,
}: OnboardingCompleteContainerProps) {
  const router = useRouter();

  return (
    <div className="bg-bg-layer-basement flex h-full items-center justify-center px-5">
      <div className="bg-bg-layer-default flex w-full flex-col items-center rounded-3xl p-8">
        <WalletHappyIcon width={61} height={60} className="mb-3" />
        <div className="mb-5 flex flex-col items-center gap-1">
          <span className="heading-1-bold">모의 계좌가 준비됐어요</span>
          <span className="body-2-regular text-text-neutral-secondary">
            시작 자금 {amount.toLocaleString()}원 · AI 위임{" "}
            {isAiDelegated ? "ON" : "OFF"}
          </span>
        </div>
        <Button onClick={() => router.replace("/home")}>
          스톡스푼 시작하기
        </Button>
      </div>
    </div>
  );
}
