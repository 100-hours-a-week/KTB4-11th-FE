import { z } from "zod";

export const NICKNAME_MAX_LENGTH = 20;
const NICKNAME_HELPER_TEXT = "닉네임은 1자 이상, 20자 이하입니다";

export const nicknameSchema = z
  .string()
  .trim()
  .min(1, NICKNAME_HELPER_TEXT)
  .max(NICKNAME_MAX_LENGTH, NICKNAME_HELPER_TEXT);

export const nicknameEditFormSchema = z.object({
  nickname: nicknameSchema,
});

export type NicknameEditFormValues = z.infer<typeof nicknameEditFormSchema>;
