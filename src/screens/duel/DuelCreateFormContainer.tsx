"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  MAX_AMOUNT,
  MIN_AMOUNT,
  duelCreationFormSchema,
  type DuelCreationFormValues,
} from "@/features/ai/schemas/duelCreationFormSchema";
import { DuelAlreadyExistsModal } from "@/features/ai/components/DuelAlreadyExistsModal";
import { DuelPeriodSelector } from "@/features/ai/components/DuelPeriodSelector";
import {
  isDuelNameAlreadyExistsError,
  useCreateCompetitionMutation,
} from "@/features/ai/hooks/useCreateCompetitionMutation";
import { useCompetitionsQuery } from "@/features/ai/hooks/useCompetitionsQuery";
import InfoIcon from "@/assets/icons/fill/info.svg";
import { InitialAmountField } from "@/features/account/components/InitialAmountField";
import { InitialAmountSlider } from "@/features/account/components/InitialAmountSlider";
import { QuickAmountChips } from "@/features/account/components/QuickAmountChips";
import { Button } from "@/shared/components/Button";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { Input } from "@/shared/components/Input";
import { toDateOnly } from "@/shared/utils/toDateOnly";

const DUEL_NAME_MAX_LENGTH = 20;
const DEFAULT_PERIOD_DAYS = 30;

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

const today = new Date();
const defaultStart = today;
const defaultEnd = addDays(today, DEFAULT_PERIOD_DAYS);

export function DuelCreateFormContainer() {
  const router = useRouter();

  const { data: duels } = useCompetitionsQuery();
  const ongoingUserVsAiDuel = (duels ?? []).find(
    (duel) => duel.type === "나 vs AI" && duel.status === "진행 중",
  );
  const [isAlreadyExistsOpen, setIsAlreadyExistsOpen] = useState(false);

  const {
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<DuelCreationFormValues>({
    resolver: zodResolver(duelCreationFormSchema),
    defaultValues: {
      name: "",
      startDate: toDateOnly(defaultStart),
      endDate: toDateOnly(defaultEnd),
      amount: 10_000_000,
    },
  });

  const name = watch("name");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const amount = watch("amount");

  const updateAmount = (value: number) =>
    setValue("amount", value, { shouldValidate: true });

  const createCompetitionMutation = useCreateCompetitionMutation({
    onSuccess: () => {
      toast.success("대결이 생성됐어요");
      router.push("/duel");
    },
    onError: (error) => {
      if (isDuelNameAlreadyExistsError(error)) {
        setError("name", { message: "이미 존재하는 대결 이름이에요" });
        return true;
      }
      return false;
    },
  });

  const canSubmit =
    !!name &&
    !!startDate &&
    !!endDate &&
    !!amount &&
    !createCompetitionMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    if (ongoingUserVsAiDuel) {
      setIsAlreadyExistsOpen(true);
      return;
    }

    createCompetitionMutation.mutate({
      competition_name: values.name,
      competition_type: "user_vs_ai",
      start_date: values.startDate,
      end_date: values.endDate,
      initial_capital: values.amount,
    });
  });

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        title="나 vs AI 대결 생성"
        className="px-5 py-3"
        left={<HeaderBackButton onClick={() => router.push("/duel")} />}
      />

      <div className="flex flex-1 flex-col gap-7 px-5 pt-6">
        <Input
          label="대결 이름"
          labelClassName="body-1-bold"
          placeholder="8월 반도체 집중"
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
          onStartDateChange={(value) =>
            setValue("startDate", value, { shouldValidate: true })
          }
          onEndDateChange={(value) =>
            setValue("endDate", value, { shouldValidate: true })
          }
          error={errors.startDate?.message ?? errors.endDate?.message}
        />

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <span className="body-1-bold">대결 자금</span>
            <InitialAmountField
              value={amount.toLocaleString()}
              onChange={(value) =>
                updateAmount(Number(value.replace(/,/g, "")) || 0)
              }
              error={errors.amount?.message}
            />
          </div>
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
          <span className="flex items-center gap-1">
            <InfoIcon
              width={12}
              height={12}
              className="text-text-neutral-tertiary"
            />
            <span className="caption-1-regular text-text-neutral-tertiary">
              나 vs AI 대결 계좌는 기본 계좌와 별도로 운용돼요
            </span>
          </span>
        </div>

        <Button
          className="mt-auto mb-8"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          대결 시작
        </Button>
      </div>

      {ongoingUserVsAiDuel && (
        <DuelAlreadyExistsModal
          open={isAlreadyExistsOpen}
          onOpenChange={setIsAlreadyExistsOpen}
          ongoingDuelId={ongoingUserVsAiDuel.id}
          ongoingDuelName={ongoingUserVsAiDuel.name}
          remainingDays={ongoingUserVsAiDuel.dDay}
        />
      )}
    </div>
  );
}
