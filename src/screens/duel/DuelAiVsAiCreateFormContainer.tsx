"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  aiVsAiDuelCreationFormSchema,
  type AiVsAiDuelCreationFormValues,
} from "@/features/ai/schemas/aiVsAiDuelCreationFormSchema";
import { DuelModelCountSelector } from "@/features/ai/components/DuelModelCountSelector";
import { DuelPeriodSelector } from "@/features/ai/components/DuelPeriodSelector";
import { InitialAmountInput } from "@/features/account/components/InitialAmountInput";
import { Button } from "@/shared/components/Button";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { Input } from "@/shared/components/Input";
import { toDateOnly } from "@/shared/utils/toDateOnly";

const DUEL_NAME_MAX_LENGTH = 20;

const defaultStart = new Date();

export function DuelAiVsAiCreateFormContainer() {
  const router = useRouter();

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AiVsAiDuelCreationFormValues>({
    resolver: zodResolver(aiVsAiDuelCreationFormSchema),
    defaultValues: {
      name: "",
      startDate: toDateOnly(defaultStart),
      endDate: "",
      amount: 10_000_000,
      modelCount: 2,
    },
  });

  const name = watch("name");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const amount = watch("amount");
  const modelCount = watch("modelCount");
  const updateAmount = (value: number) =>
    setValue("amount", value, { shouldValidate: true });

  const canSubmit = !!name && !!startDate && !!endDate && !!amount;

  const onSubmit = handleSubmit(() => {
    toast.info("에이전트 세팅 화면은 준비 중이에요");
  });

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        title="AI끼리 대결 생성"
        className="px-5 py-3"
        left={<HeaderBackButton onClick={() => router.push("/duel")} />}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-5 pt-6">
        <Input
          label="대결 이름"
          labelClassName="body-1-bold"
          placeholder="전략 A vs B"
          value={name}
          maxLength={DUEL_NAME_MAX_LENGTH}
          onChange={(value) =>
            setValue("name", value, { shouldValidate: true })
          }
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <DuelPeriodSelector
          startDate={startDate}
          endDate={endDate}
          onEndDateChange={(value) =>
            setValue("endDate", value, { shouldValidate: true })
          }
          error={errors.startDate?.message ?? errors.endDate?.message}
        />

        <div className="flex flex-col gap-3">
          <span className="body-1-bold">투입 금액</span>
          <InitialAmountInput
            value={amount}
            onChange={updateAmount}
            error={errors.amount?.message}
          />
        </div>

        <DuelModelCountSelector
          value={modelCount}
          onChange={(value) =>
            setValue("modelCount", value, { shouldValidate: true })
          }
        />

        <Button
          className="mt-auto mb-8 shrink-0"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          전략 세팅하기
        </Button>
      </div>
    </div>
  );
}
