import { z } from "zod";

export const MIN_AMOUNT = 1_000_000;
export const MAX_AMOUNT = 100_000_000;

export const ACCOUNT_NAME_MAX_LENGTH = 20;
const ACCOUNT_NAME_HELPER_TEXT = "계좌명은 1자 이상, 20자 이하입니다";

export const accountNameSchema = z
  .string()
  .min(1, ACCOUNT_NAME_HELPER_TEXT)
  .max(ACCOUNT_NAME_MAX_LENGTH, ACCOUNT_NAME_HELPER_TEXT);

export const accountCreationFormSchema = z.object({
  accountName: accountNameSchema,
  amount: z
    .number()
    .min(MIN_AMOUNT, "100만원 이상 입력해 주세요")
    .max(MAX_AMOUNT, "1억원 이하로 입력해 주세요"),
});

export type AccountCreationFormValues = z.infer<
  typeof accountCreationFormSchema
>;
