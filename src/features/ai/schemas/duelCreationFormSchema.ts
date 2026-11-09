import { z } from "zod";
import {
  MAX_AMOUNT,
  MIN_AMOUNT,
} from "@/features/account/schemas/accountCreationFormSchema";
import { toDateOnly } from "@/shared/utils/toDateOnly";

export { MAX_AMOUNT, MIN_AMOUNT };

export const DUEL_NAME_MAX_LENGTH = 20;
export const DUEL_MIN_PERIOD_DAYS = 7;
export const DUEL_MAX_PERIOD_DAYS = 90;

const DUEL_NAME_HELPER_TEXT = "대결 이름은 1자 이상, 20자 이하입니다";

export const duelNameSchema = z
  .string()
  .trim()
  .min(1, DUEL_NAME_HELPER_TEXT)
  .max(DUEL_NAME_MAX_LENGTH, DUEL_NAME_HELPER_TEXT);

export const duelCreationBaseSchema = z.object({
  name: duelNameSchema,
  startDate: z.string().min(1, "시작일을 선택해 주세요"),
  endDate: z.string().min(1, "종료일을 선택해 주세요"),
  amount: z
    .number()
    .int("원 단위 정수로 입력해 주세요")
    .min(MIN_AMOUNT, "100만원 이상 입력해 주세요")
    .max(MAX_AMOUNT, "1억원 이하로 입력해 주세요"),
});

export function withDuelPeriodValidation<
  T extends z.ZodType<{ startDate: string; endDate: string }>,
>(schema: T) {
  return schema
    .refine(
      (values) => {
        return values.startDate >= toDateOnly(new Date());
      },
      {
        message: "과거 날짜는 선택할 수 없어요",
        path: ["startDate"],
      },
    )
    .refine(
      (values) => {
        const days =
          (new Date(values.endDate).getTime() -
            new Date(values.startDate).getTime()) /
          (1000 * 60 * 60 * 24);
        return days >= DUEL_MIN_PERIOD_DAYS && days <= DUEL_MAX_PERIOD_DAYS;
      },
      {
        message: `대결 기간은 최소 ${DUEL_MIN_PERIOD_DAYS}일, 최대 ${DUEL_MAX_PERIOD_DAYS}일입니다`,
        path: ["endDate"],
      },
    );
}

export const duelCreationFormSchema = withDuelPeriodValidation(
  duelCreationBaseSchema,
);

export type DuelCreationFormValues = z.infer<typeof duelCreationFormSchema>;
