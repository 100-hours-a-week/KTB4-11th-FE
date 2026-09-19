"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { Header } from "@/shared/components/Header";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalPortal,
  ModalTitle,
} from "@/shared/components/Modal";
import { AiDelegationSwitch } from "@/features/account/components/AiDelegationSwitch";
import { InitialAmountField } from "@/features/account/components/InitialAmountField";
import { InitialAmountSlider } from "@/features/account/components/InitialAmountSlider";
import { QuickAmountChips } from "@/features/account/components/QuickAmountChips";
import {
  MAX_AMOUNT,
  MIN_AMOUNT,
  onboardingFormSchema,
  type OnboardingFormValues,
} from "@/features/account/schemas/onboardingFormSchema";

export function AccountCreationContainer() {
  const [isAiDelegated, setIsAiDelegated] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: { amount: 10_000_000 },
  });
  const amount = watch("amount");

  return (
    <div className="flex h-full flex-col">
      <Header title="시작 계좌 만들기" />

      <div className="flex flex-1 flex-col gap-7 px-6 pt-6">
        <div className="flex flex-col gap-3">
          <span className="body-1-bold">AI 위임 설정</span>
          <AiDelegationSwitch
            checked={isAiDelegated}
            onCheckedChange={(checked) => {
              if (checked) {
                setIsAiDelegated(true);
              } else {
                setIsModalOpen(true);
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-3">
          <span className="body-1-bold">시작 자금</span>
          <InitialAmountField
            value={amount.toLocaleString()}
            onChange={(value) =>
              setValue("amount", Number(value.replace(/,/g, "")) || 0, {
                shouldValidate: true,
              })
            }
            error={errors.amount?.message}
          />
          <QuickAmountChips
            onAdd={(value) =>
              setValue("amount", amount + value, { shouldValidate: true })
            }
            onManualInput={() =>
              setValue("amount", 0, { shouldValidate: true })
            }
          />
          <InitialAmountSlider
            value={amount}
            onValueChange={(value) =>
              setValue("amount", value, { shouldValidate: true })
            }
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

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalPortal>
          <ModalContent>
            <ModalTitle>지금은 AI 위임 투자만 가능해요</ModalTitle>
            <ModalDescription>
              직접 투자는 v2에서 이용할 수 있어요.
              <br />
              조금만 기다려 주세요!
            </ModalDescription>
            <ModalClose asChild>
              <Button className="mt-6">확인</Button>
            </ModalClose>
          </ModalContent>
        </ModalPortal>
      </Modal>
    </div>
  );
}
