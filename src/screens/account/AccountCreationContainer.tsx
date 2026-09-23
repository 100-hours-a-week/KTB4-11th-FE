"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  isAccountNameAlreadyExistsError,
  useCreateAccountMutation,
} from "@/features/account/hooks/useCreateAccountMutation";
import {
  ACCOUNT_NAME_MAX_LENGTH,
  accountCreationFormSchema,
  MAX_AMOUNT,
  MIN_AMOUNT,
  type AccountCreationFormValues,
} from "@/features/account/schemas/accountCreationFormSchema";
import { Input } from "@/shared/components/Input";
import { useAccountStore } from "@/store/accountStore";

interface AccountCreationContainerProps {
  headerTitle: string;
  submitLabel: string;
  showAccountNameField?: boolean;
}

export function AccountCreationContainer({
  headerTitle,
  submitLabel,
  showAccountNameField = false,
}: AccountCreationContainerProps) {
  const router = useRouter();
  const setSelectedAccountId = useAccountStore(
    (state) => state.setSelectedAccountId,
  );
  const [isAiDelegated, setIsAiDelegated] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountCreationFormValues>({
    resolver: zodResolver(accountCreationFormSchema),
    defaultValues: {
      accountName: showAccountNameField ? "" : "기본계좌",
      amount: 10_000_000,
    },
  });
  const amount = watch("amount");
  const accountName = watch("accountName");

  const updateAmount = (value: number) =>
    setValue("amount", value, { shouldValidate: true });

  const { mutate, isPending } = useCreateAccountMutation(
    showAccountNameField
      ? {
          onSuccess: (data) => {
            setSelectedAccountId(data.account_id);
            router.replace("/home");
          },
          onError: (error) => {
            if (isAccountNameAlreadyExistsError(error)) {
              setError("accountName", {
                message: "이미 존재하는 계좌명이에요",
              });
              return true;
            }
            return false;
          },
        }
      : {
          onSuccess: (data) => {
            router.replace(
              `/onboarding/complete?amount=${data.initial_capital}`,
            );
          },
        },
  );

  const onSubmit = handleSubmit(({ amount: initial_capital, accountName }) => {
    mutate(
      showAccountNameField
        ? { initial_capital, account_name: accountName }
        : { initial_capital },
    );
  });

  return (
    <div className="flex h-full flex-col">
      <Header title={headerTitle} />

      <div className="flex flex-1 flex-col gap-7 px-5 pt-6">
        {showAccountNameField && (
          <Input
            label="계좌 이름"
            labelClassName="body-1-bold"
            placeholder="계좌 이름을 입력해 주세요"
            value={accountName}
            maxLength={ACCOUNT_NAME_MAX_LENGTH}
            onChange={(value) =>
              setValue("accountName", value, { shouldValidate: true })
            }
            error={!!errors.accountName}
            helperText={errors.accountName?.message}
          />
        )}

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
              updateAmount(Number(value.replace(/,/g, "")) || 0)
            }
            error={errors.amount?.message}
          />
          <QuickAmountChips
            onAdd={(value) => updateAmount(amount + value)}
            onManualInput={() => updateAmount(0)}
          />
          <InitialAmountSlider
            value={amount}
            onValueChange={updateAmount}
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
            minLabel="100만"
            maxLabel="1억"
          />
          <p className="caption-1-regular text-text-neutral-tertiary">
            한 번 설정한 시작 금액은 나중에 바꿀 수 없어요
          </p>
        </div>

        <Button
          className="mt-auto mb-8"
          onClick={onSubmit}
          disabled={isPending}
        >
          {submitLabel}
        </Button>
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
