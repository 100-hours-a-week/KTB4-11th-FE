import { z } from "zod";

export const MIN_AMOUNT = 1_000_000;
export const MAX_AMOUNT = 100_000_000;

export const onboardingFormSchema = z.object({
  amount: z
    .number()
    .min(MIN_AMOUNT, "100만원 이상 입력해 주세요")
    .max(MAX_AMOUNT, "1억원 이하로 입력해 주세요"),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
