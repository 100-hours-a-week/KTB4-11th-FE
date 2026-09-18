"use client";

import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { Header } from "@/shared/components/Header";
import { AiDelegationSwitch } from "@/features/account/components/AiDelegationSwitch";
import { InitialAmountField } from "@/features/account/components/InitialAmountField";
import { InitialAmountSlider } from "@/features/account/components/InitialAmountSlider";
import { QuickAmountChips } from "@/features/account/components/QuickAmountChips";

const MIN_AMOUNT = 1_000_000;
const MAX_AMOUNT = 100_000_000;

export function AccountCreationContainer() {
  const [isAiDelegated, setIsAiDelegated] = useState(true);
  const [amount, setAmount] = useState(10_000_000);

  return (
    <div className="flex h-full flex-col">
      <Header title="시작 계좌 만들기" />

      <div className="flex flex-1 flex-col gap-7 px-6 pt-6">
        <div className="flex flex-col gap-3">
          <span className="body-1-bold">AI 위임 설정</span>
          <AiDelegationSwitch
            checked={isAiDelegated}
            onCheckedChange={setIsAiDelegated}
          />
        </div>

        <div className="flex flex-col gap-3">
          <span className="body-1-bold">시작 자금</span>
          <InitialAmountField
            value={amount.toLocaleString()}
            onChange={(value) =>
              setAmount(Number(value.replace(/,/g, "")) || 0)
            }
          />
          <QuickAmountChips
            onAdd={(value) => setAmount((prev) => prev + value)}
            onManualInput={() => setAmount(0)}
          />
          <InitialAmountSlider
            value={amount}
            onValueChange={setAmount}
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
            minLabel="100만"
            maxLabel="1억"
          />
          <p className="caption-1-regular text-text-neutral-tertiary">
            한 번 설정한 시작 금액은 나중에 바꿀 수 없어요
          </p>
        </div>

        <Button className="mt-auto mb-8">계좌 개설하기</Button>
      </div>
    </div>
  );
}
